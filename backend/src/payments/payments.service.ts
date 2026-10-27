import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUniqueViolation } from '../common/idempotency.js';
import { assertTransition, canTransition } from '../orders/order-status.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePaymentDto } from './dto/create-payment.dto.js';
import { MockPaymentGateway } from './mock-gateway.js';

type PaymentRow = {
  id: number;
  orderId: string;
  method: string;
  amount: number;
  status: string;
  failureReason: string | null;
};

// Dạng trả về cho client; lần gửi lại cùng Idempotency-Key cũng đi qua hàm này
const toResponse = (p: PaymentRow) => ({
  paymentId: p.id,
  orderId: p.orderId,
  method: p.method,
  amount: p.amount,
  status: p.status === 'SUCCESS' ? 'PAID' : 'PAYMENT_FAILED',
  reason: p.failureReason ?? undefined,
});

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: MockPaymentGateway,
  ) {}

  async pay(userId: number, dto: CreatePaymentDto, idempotencyKey?: string) {
    // Đơn của người khác cũng báo 404 để không lộ đơn có tồn tại
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const findExisting = () =>
      this.prisma.payment.findUnique({
        where: {
          orderId_idempotencyKey: { orderId: order.id, idempotencyKey: idempotencyKey! },
        },
      });
    // Phải kiểm tra trước khi xét trạng thái đơn: gửi lại sau khi đơn đã PAID
    // vẫn phải nhận kết quả cũ, không phải 409
    if (idempotencyKey) {
      const existing = await findExisting();
      if (existing) return toResponse(existing);
    }

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

    try {
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
            failureReason: result.reason,
            idempotencyKey,
          },
        });
      });
      return toResponse(payment);
    } catch (e) {
      // Hai yêu cầu cùng key đến cùng lúc: yêu cầu thua trả lại kết quả của yêu cầu thắng
      if (idempotencyKey && (isUniqueViolation(e) || e instanceof ConflictException)) {
        const existing = await findExisting();
        if (existing) return toResponse(existing);
      }
      throw e;
    }
  }
}
