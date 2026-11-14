import { BadRequestException } from '@nestjs/common';

// Mã giảm giá cố định trong code, giống bảng giá ở pricing.ts.
// ponytail: không có bảng PromoCode trong DB, hạn dùng hay số lượt; thêm bảng khi cần quản lý mã qua giao diện.
type Promo = { percent?: number; amount?: number; maxDiscount?: number; minSubtotal: number };

export const PROMO_CODES: Record<string, Promo> = {
  // Giảm 10%, tối đa 20.000đ
  BREW10: { percent: 10, maxDiscount: 20_000, minSubtotal: 0 },
  // Giảm 15.000đ cho đơn từ 50.000đ
  GIAM15K: { amount: 15_000, minSubtotal: 50_000 },
};

// Số tiền được giảm (VND). Mã sai hoặc đơn chưa đủ điều kiện thì 400.
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
  // Không giảm quá trần, và không bao giờ làm tổng âm
  return { code, discount: Math.min(raw, promo.maxDiscount ?? raw, subtotal) };
}
