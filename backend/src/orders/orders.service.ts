import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { isUniqueViolation } from '../common/idempotency.js';
import type { OrderStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import { assertTransition, type StaffStep } from './order-status.js';
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
      select: HISTORY,
    });
    return orders.map(toHistory);
  }

  // Khách hủy đơn chưa thanh toán; kho đã giữ lúc đặt được hoàn lại
  async cancel(userId: number, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { select: { productId: true, quantity: true } } },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    assertTransition(order.status, 'CANCELLED');

    await this.prisma.$transaction(async (tx) => {
      await setStatus(tx, order, 'CANCELLED');
      for (const i of order.items) {
        await tx.product.update({
          where: { id: i.productId },
          data: { stock: { increment: i.quantity } },
        });
      }
    });
    return { id: order.id, status: 'CANCELLED' as const, total: order.total };
  }

  // Nhân viên quầy đẩy đơn qua PREPARING → READY → COMPLETED
  async advance(userId: number, orderId: string, to: StaffStep) {
    await this.assertStaff(userId);
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    assertTransition(order.status, to);
    await setStatus(this.prisma, order, to);
    return { id: order.id, status: to, total: order.total };
  }

  // Hàng đợi của quầy: đơn đã trả tiền chưa giao, cũ nhất trước
  async queue(userId: number) {
    await this.assertStaff(userId);
    const orders = await this.prisma.order.findMany({
      where: { status: { in: ['PAID', 'PREPARING', 'READY'] } },
      orderBy: { createdAt: 'asc' },
      select: HISTORY,
    });
    return orders.map(toHistory);
  }

  // Đọc role từ DB thay vì từ token để hạ quyền có hiệu lực ngay
  private async assertStaff(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role !== 'STAFF') {
      throw new ForbiddenException('Chỉ nhân viên quầy được thực hiện thao tác này');
    }
  }
}

// Khoá lạc quan: chỉ ghi khi version chưa đổi kể từ lúc đọc, như payments.service.ts
async function setStatus(
  tx: Pick<PrismaService, 'order'>,
  order: { id: string; version: number },
  status: OrderStatus,
) {
  const { count } = await tx.order.updateMany({
    where: { id: order.id, version: order.version },
    data: { status, version: { increment: 1 } },
  });
  if (count === 0) {
    throw new ConflictException('Đơn vừa được cập nhật bởi yêu cầu khác, vui lòng thử lại');
  }
}

const HISTORY = {
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
} as const;

type HistoryRow = {
  items: { product: { name: string } }[];
};

const toHistory = <T extends HistoryRow>({ items, ...order }: T) => ({
  ...order,
  items: items.map(({ product, ...item }) => ({ ...item, productName: product.name })),
});
