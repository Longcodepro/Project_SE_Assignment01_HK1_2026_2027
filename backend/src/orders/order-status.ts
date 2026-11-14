import { ConflictException } from '@nestjs/common';
import type { OrderStatus } from '../generated/prisma/enums.js';

// Nguồn sự thật duy nhất cho vòng đời đơn hàng:
//
//   PENDING ──thanh toán OK──► PAID ──► PREPARING ──► READY ──► COMPLETED
//      │  ▲                     ▲      (nhân viên)  (nhân viên) (nhân viên)
//      │  └──────────┐          │
//      ▼             │ thanh toán lại
//   PAYMENT_FAILED ──┘──────────┘
//      │
//   (khách hủy từ PENDING hoặc PAYMENT_FAILED) ──► CANCELLED
//
// COMPLETED và CANCELLED là trạng thái cuối. Đơn đã PAID không hủy được
// (hoàn tiền nằm ngoài phạm vi). Thanh toán lại mà vẫn lỗi thì đơn giữ nguyên
// PAYMENT_FAILED, không tính là một lần chuyển trạng thái.
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING'],
  PREPARING: ['READY'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

// Các bước nhân viên quầy được bấm (PATCH /orders/:id/status)
export const STAFF_STEPS = ['PREPARING', 'READY', 'COMPLETED'] as const;
export type StaffStep = (typeof STAFF_STEPS)[number];

export const canTransition = (from: OrderStatus, to: OrderStatus) =>
  ORDER_TRANSITIONS[from].includes(to);

export function assertTransition(from: OrderStatus, to: OrderStatus) {
  if (!canTransition(from, to)) {
    throw new ConflictException(
      `Không thể chuyển đơn từ ${from} sang ${to}`,
    );
  }
}
