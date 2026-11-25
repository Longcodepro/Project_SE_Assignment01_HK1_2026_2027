// =============================================================================
// MOCK PAYMENT GATEWAY - CỔNG THANH TOÁN MÔ PHỎNG
// =============================================================================

import { Injectable } from '@nestjs/common';

export type ChargeInput = {
  method: 'WALLET' | 'CARD';
  amount: number;
  cardNumber?: string;
};

/**
 * Ngưỡng hạn mức ví điện tử mô phỏng: 500.000đ.
 * Đơn hàng trên mức này sẽ bị báo lỗi không đủ số dư ví.
 */
export const WALLET_LIMIT = 500_000;

@Injectable()
export class MockPaymentGateway {
  /**
   * Mô phỏng trừ tiền qua cổng thanh toán với kịch bản kiểm thử cố định:
   * 1. Thanh toán bằng Thẻ (CARD): Số thẻ kết thúc bằng '0000' -> Luôn bị từ chối.
   * 2. Thanh toán bằng Ví (WALLET): Giá trị đơn vượt quá 500.000đ -> Báo số dư không đủ.
   * 3. Các trường hợp còn lại: Thanh toán thành công (ok = true).
   */
  charge({ method, amount, cardNumber }: ChargeInput) {
    if (method === 'CARD' && cardNumber?.endsWith('0000')) {
      return { ok: false, reason: 'Thẻ bị từ chối' };
    }
    if (method === 'WALLET' && amount > WALLET_LIMIT) {
      return { ok: false, reason: 'Số dư ví không đủ' };
    }
    return { ok: true as const, reason: undefined };
  }
}
