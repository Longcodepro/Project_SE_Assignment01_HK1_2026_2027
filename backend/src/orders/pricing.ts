// =============================================================================
// PRICING RULES - BẢNG GIÁ & QUY TẮC TÍNH TIỀN ĐỒ UỐNG
// =============================================================================

/**
 * Phụ thu theo kích cỡ ly (Size):
 * - S: +0đ (Size chuẩn)
 * - M: +5.000đ
 * - L: +10.000đ
 * Phải khớp 100% với modal chi tiết sản phẩm ở frontend.
 */
export const SIZE_EXTRA = { S: 0, M: 5000, L: 10000 } as const;

/**
 * Bảng giá các loại topping thêm:
 * - Trân châu  : 8.000đ
 * - Kem cheese : 10.000đ
 * - Thạch cà phê: 6.000đ
 */
export const TOPPING_PRICE = {
  'tran-chau': 8000,
  'kem-cheese': 10000,
  'thach-cafe': 6000,
} as const;

export type SizeId = keyof typeof SIZE_EXTRA;
export type ToppingId = keyof typeof TOPPING_PRICE;

/**
 * Tính đơn giá cho 1 ly:
 * UnitPrice = Giá cơ bản + Phụ thu size + Tổng giá topping
 * Server luôn tự tính toán lại toàn bộ, không bao giờ tin cậy giá do client gửi lên!
 */
export const unitPrice = (
  basePrice: number,
  size: SizeId,
  toppings: ToppingId[],
) =>
  basePrice +
  SIZE_EXTRA[size] +
  toppings.reduce((sum, t) => sum + TOPPING_PRICE[t], 0);
