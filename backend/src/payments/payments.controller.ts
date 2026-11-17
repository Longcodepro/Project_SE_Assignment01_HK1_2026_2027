// =============================================================================
// PAYMENTS CONTROLLER - CÁC ENDPOINT THANH TOÁN
// =============================================================================

import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { parseIdempotencyKey } from '../common/idempotency.js';
import { CreatePaymentDto, PaymentResponseDto } from './dto/create-payment.dto.js';
import { PaymentsService } from './payments.service.js';

@ApiTags('payments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Thiếu hoặc sai JWT token xác thực' })
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thanh toán đơn hàng qua cổng mô phỏng (Ví điện tử hoặc Thẻ)' })
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description: 'Khóa chống thanh toán trùng: gửi lại cùng key trả kết quả cũ, không trừ tiền lần 2',
  })
  @ApiCreatedResponse({
    type: PaymentResponseDto,
    description: 'Kết quả thanh toán: Trạng thái PAID nếu thành công hoặc PAYMENT_FAILED nếu bị từ chối',
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ (ví dụ: thiếu thông tin thẻ)' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng của bạn' })
  @ApiConflictResponse({ description: 'Đơn hàng đã được thanh toán hoặc đang được xử lý đồng thời' })
  pay(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePaymentDto,
    @Headers('idempotency-key') key?: string,
  ) {
    return this.payments.pay(user.id, dto, parseIdempotencyKey(key));
  }
}
