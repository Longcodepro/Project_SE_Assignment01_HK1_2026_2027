// =============================================================================
// LOYALTY POINTS - CHÍNH SÁCH TÍCH LŨY ĐIỂM THƯỞNG
// =============================================================================

// Tỷ lệ quy đổi: Mỗi 1.000đ giá trị đơn hàng được tích 1 điểm thưởng
export const VND_PER_POINT = 1000;

/**
 * Tính số điểm tích lũy dựa trên tổng tiền thanh toán:
 * Ví dụ: Đơn 49.000đ -> Tích được 49 điểm (làm tròn xuống).
 */
export const pointsFor = (orderTotal: number) =>
  Math.floor(orderTotal / VND_PER_POINT);
