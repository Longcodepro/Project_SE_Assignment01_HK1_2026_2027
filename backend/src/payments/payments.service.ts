import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assertTransition, canTransition } from '../orders/order-status.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePaymentDto } from './dto/create-payment.dto.js';
import { MockPaymentGateway } from './mock-gateway.js';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MockPaymentGateway,
  ) {}

  async pay(userId: number, dto: CreatePaymentDto) {
    // Đơn của người khác cũng báo 404 để không lộ đơn có tồn tại
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (!canTransition(order.status, 'PAID')) {
      throw new ConflictException(
        `Đơn đang ở trạng thái ${order.status}, không thể thanh toán`,
      );
    }

    const result = this.gateway.charge({
      method: dto.method,
      amount: order.total,
      cardNumber: dto.cardNumber,
    });
    const orderStatus = result.ok ? 'PAID' : 'PAYMENT_FAILED';
    // Thử lại mà vẫn lỗi: chỉ ghi thêm một lần thanh toán, đơn giữ nguyên trạng thái
    const changesStatus = orderStatus !== order.status;
    if (changesStatus) assertTransition(order.status, orderStatus);

    const payment = await this.prisma.$transaction(async (tx) => {
      if (changesStatus) {
        // Chỉ đổi khi đơn vẫn đúng trạng thái lúc đọc, chặn hai yêu cầu cùng xử lý một đơn
        const updated = await tx.order.updateMany({
          where: { id: order.id, status: order.status },
          data: { status: orderStatus },
        });
        if (updated.count === 0) {
          throw new ConflictException('Đơn đã được xử lý bởi yêu cầu khác');
        }
      }
      return tx.payment.create({
        data: {
          orderId: order.id,
          method: dto.method,
          status: result.ok ? 'SUCCESS' : 'FAILED',
          amount: order.total,
        },
      });
    });

    return {
      paymentId: payment.id,
      orderId: order.id,
      method: payment.method,
      amount: payment.amount,
      status: orderStatus,
      reason: result.reason,
    };
  }
}
