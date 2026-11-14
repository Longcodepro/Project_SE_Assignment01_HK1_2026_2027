import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { isUniqueViolation } from '../common/idempotency.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import { unitPrice } from './pricing.js';

const SUMMARY = { id: true, status: true, total: true } as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto, idempotencyKey?: string) {
    const findExisting = () =>
      this.prisma.order.findUnique({
        where: { userId_idempotencyKey: { userId, idempotencyKey: idempotencyKey! } },
        select: SUMMARY,
      });
    if (idempotencyKey) {
      const existing = await findExisting();
      if (existing) return existing;
    }

    const ids = [...new Set(dto.items.map((i) => i.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
    const priceById = new Map(products.map((p) => [p.id, p.price]));
    const missing = ids.filter((id) => !priceById.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `Sản phẩm không tồn tại: ${missing.join(', ')}`,
      );
    }

    const items = dto.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
      toppings: i.toppings ?? [],
      unitPrice: unitPrice(priceById.get(i.productId)!, i.size, i.toppings ?? []),
    }));
    const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    // Cộng dồn số ly theo sản phẩm (một sản phẩm có thể nằm ở nhiều dòng khác size)
    const qtyById = new Map<number, number>();
    for (const i of items) qtyById.set(i.productId, (qtyById.get(i.productId) ?? 0) + i.quantity);

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Trừ kho có điều kiện: UPDATE ... WHERE stock >= qty là một câu lệnh nguyên tử,
        // hai yêu cầu đồng thời không thể cùng thấy "còn hàng" rồi cùng trừ.
        // Một sản phẩm thiếu hàng thì ném lỗi, transaction hoàn lại các lần trừ trước.
        for (const [productId, qty] of qtyById) {
          const { count } = await tx.product.updateMany({
            where: { id: productId, stock: { gte: qty } },
            data: { stock: { decrement: qty } },
          });
          if (count === 0) {
            throw new ConflictException(`Sản phẩm ${productId} không đủ hàng cho ${qty} ly`);
          }
        }
        return tx.order.create({
          data: {
            id: `ord_${randomBytes(5).toString('hex')}`,
            userId,
            idempotencyKey,
            total,
            items: { create: items },
          },
          select: SUMMARY,
        });
      });
    } catch (e) {
      // Hai yêu cầu cùng key đến cùng lúc: yêu cầu thua trả lại đơn của yêu cầu thắng
      if (idempotencyKey && isUniqueViolation(e)) {
        const existing = await findExisting();
        if (existing) return existing;
      }
      throw e;
    }
  }

  async findMine(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          orderBy: { id: 'asc' },
          select: {
            productId: true,
            quantity: true,
            size: true,
            toppings: true,
            unitPrice: true,
            product: { select: { name: true } },
          },
        },
      },
    });
    return orders.map(({ items, ...order }) => ({
      ...order,
      items: items.map(({ product, ...item }) => ({
        ...item,
        productName: product.name,
      })),
    }));
  }
}
