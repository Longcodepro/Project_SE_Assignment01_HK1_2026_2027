// =============================================================================
// ORDER STATUS FINITE STATE MACHINE (FSM)
// Máy trạng thái hữu hạn kiểm soát chuyển đổi vòng đời đơn hàng
// =============================================================================

import { ConflictException } from '@nestjs/common';
import type { OrderStatus } from '../generated/prisma/enums.js';

/**
 * Ma trận chuyển đổi trạng thái hợp lệ:
 *
 *   PENDING ──thanh toán OK──► PAID ──► PREPARING ──► READY ──► COMPLETED
 *      │  ▲                     ▲
 *      │  └──────────┐          │
 *      ▼             │ thanh toán lại
 *   PAYMENT_FAILED ──┘──────────┘
 *      │
 *   (hủy từ PENDING hoặc PAYMENT_FAILED) ──► CANCELLED
 *
 * Quy tắc nghiệp vụ:
 * - COMPLETED và CANCELLED là các trạng thái kết thúc (không thể chuyển đi đâu nữa).
 * - Đơn đã PAID không được phép hủy (hoàn tiền nằm ngoài phạm vi đồ án).
 * - Thanh toán lại mà vẫn lỗi thì đơn giữ nguyên PAYMENT_FAILED.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING'],
  PREPARING: ['READY'],
  READY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export const canTransition = (from: OrderStatus, to: OrderStatus) =>
  ORDER_TRANSITIONS[from].includes(to);

/**
 * Kiểm tra tính hợp lệ của việc chuyển trạng thái:
 * Nếu chuyển sai quy trình -> ném lỗi 409 Conflict ngay lập tức.
 */
export function assertTransition(from: OrderStatus, to: OrderStatus) {
  if (!canTransition(from, to)) {
    throw new ConflictException(
      `Không thể chuyển đơn từ ${from} sang ${to}`,
    );
  }
}
