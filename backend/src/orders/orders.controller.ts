// =============================================================================
// ORDERS CONTROLLER - CÁC ENDPOINT ĐẶT HÀNG & LỊCH SỬ ĐƠN (MVP)
// =============================================================================

import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { parseIdempotencyKey } from '../common/idempotency.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderHistoryDto, OrderSummaryDto } from './dto/order.dto.js';
import { OrdersService } from './orders.service.js';

@ApiTags('orders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Thiếu hoặc sai JWT token xác thực' })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khách hàng đặt đơn; tổng tiền và giảm giá do server tính toán' })
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description: 'Khóa chống gửi trùng: gửi lại cùng key trả đơn cũ, không tạo đơn mới',
  })
  @ApiCreatedResponse({ type: OrderSummaryDto, description: 'Đơn hàng tạo thành công (status: PENDING)' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc sản phẩm không tồn tại' })
  @ApiConflictResponse({ description: 'Sản phẩm không đủ số lượng tồn kho' })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
    @Headers('idempotency-key') key?: string,
  ) {
    return this.ordersService.create(user.id, dto, parseIdempotencyKey(key));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xem lịch sử đơn hàng của tôi (đơn mới nhất xếp lên đầu)' })
  @ApiOkResponse({ type: OrderHistoryDto, isArray: true })
  findMine(@CurrentUser() user: AuthUser) {
    return this.ordersService.findMine(user.id);
  }
}
