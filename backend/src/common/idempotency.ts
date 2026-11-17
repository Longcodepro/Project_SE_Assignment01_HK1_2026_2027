// =============================================================================
// IDEMPOTENCY KEY UTILITIES - CHỐNG GỬI YÊU CẦU TRÙNG LẶP
// =============================================================================

import { BadRequestException } from '@nestjs/common';

// Định dạng hợp lệ cho Idempotency-Key: từ 1 đến 128 ký tự gồm chữ cái, số, gạch dưới (_) hoặc gạch ngang (-)
const KEY = /^[A-Za-z0-9_-]{1,128}$/;

/**
 * Trích xuất và kiểm tra tính hợp lệ của Header Idempotency-Key.
 * - Header này là tùy chọn: nếu client không gửi thì trả về undefined.
 * - Nếu client gửi sai định dạng (chứa ký tự lạ hoặc quá dài) -> ném lỗi 400 Bad Request.
 */
export function parseIdempotencyKey(raw?: string) {
  if (raw === undefined) return undefined;
  if (!KEY.test(raw)) {
    throw new BadRequestException(
      'Idempotency-Key must be 1-128 characters: letters, digits, _ or -',
    );
  }
  return raw;
}

/**
 * Nhận diện lỗi vi phạm ràng buộc Unique trong Prisma (Mã lỗi P2002).
 * Dùng khi 2 yêu cầu cùng Idempotency-Key đến server cùng một thời điểm:
 * Yêu cầu nào đến sau sẽ bắt lỗi này để đọc và trả lại kết quả của yêu cầu trước đó.
 */
export const isUniqueViolation = (e: unknown) =>
  (e as { code?: string } | null)?.code === 'P2002';
