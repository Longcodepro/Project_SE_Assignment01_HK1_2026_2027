// =============================================================================
// GLOBAL VALIDATION PIPE - XÁC THỰC DỮ LIỆU ĐẦU VÀO
// =============================================================================

import { ValidationPipe } from '@nestjs/common';

/**
 * Tạo ValidationPipe dùng chung cho cả main.ts và các bài test e2e/controller:
 * - whitelist: true -> Loại bỏ hoàn toàn các trường không được khai báo trong DTO.
 * - forbidNonWhitelisted: true -> Ném lỗi 400 nếu client cố tình gửi các trường lạ ngoài DTO.
 * - transform: true -> Tự động chuyển đổi kiểu dữ liệu tương ứng theo khai báo DTO.
 */
export const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
