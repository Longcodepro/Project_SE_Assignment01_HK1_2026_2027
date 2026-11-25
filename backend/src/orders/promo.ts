// =============================================================================
// PROMO CODES - CHÍNH SÁCH MÃ GIẢM GIÁ
// =============================================================================

import { BadRequestException } from '@nestjs/common';

type Promo = {
  percent?: number;      // Tỷ lệ giảm theo phần trăm (%)
  amount?: number;       // Số tiền giảm cố định (VND)
  maxDiscount?: number;  // Mức giảm tối đa (VND)
  minSubtotal: number;   // Giá trị đơn hàng tối thiểu để được áp dụng
};

/**
 * Danh sách mã giảm giá cố định trong hệ thống:
 * - BREW10 : Giảm 10%, tối đa 20.000đ, không yêu cầu giá trị đơn tối thiểu.
 * - GIAM15K: Giảm thẳng 15.000đ cho đơn từ 50.000đ trở lên.
 */
export const PROMO_CODES: Record<string, Promo> = {
  BREW10: { percent: 10, maxDiscount: 20_000, minSubtotal: 0 },
  GIAM15K: { amount: 15_000, minSubtotal: 50_000 },
};

/**
 * Tính số tiền được giảm giá (VND):
 * - Ném lỗi 400 nếu mã không tồn tại hoặc đơn chưa đạt giá trị tối thiểu.
 * - Đảm bảo số tiền giảm không vượt quá trần maxDiscount và không bao giờ vượt quá tổng tiền đơn.
 */
export function discountFor(rawCode: string, subtotal: number) {
  const code = rawCode.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (!promo) throw new BadRequestException(`Mã giảm giá ${code} không hợp lệ`);
  if (subtotal < promo.minSubtotal) {
    throw new BadRequestException(
      `Mã ${code} chỉ áp dụng cho đơn từ ${promo.minSubtotal.toLocaleString('vi-VN')}đ`,
    );
  }
  const raw = promo.percent
    ? Math.floor((subtotal * promo.percent) / 100)
    : (promo.amount ?? 0);

  return { code, discount: Math.min(raw, promo.maxDiscount ?? raw, subtotal) };
}
