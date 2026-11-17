// =============================================================================
// ORDERS CONTROLLER - CÁC ENDPOINT ĐẶT HÀNG, LỊCH SỬ & QUẢN LÝ ĐƠN
// =============================================================================

import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { parseIdempotencyKey } from '../common/idempotency.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import {
  OrderHistoryDto,
  OrderSummaryDto,
  UpdateOrderStatusDto,
} from './dto/order.dto.js';
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

  @Get('queue')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Nhân viên quầy: xem hàng đợi các đơn PAID/PREPARING/READY (cũ nhất lên đầu)' })
  @ApiOkResponse({ type: OrderHistoryDto, isArray: true })
  @ApiForbiddenResponse({ description: 'Tài khoản không phải vai trò STAFF' })
  queue(@CurrentUser() user: AuthUser) {
    return this.ordersService.queue(user.id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khách tự hủy đơn chưa thanh toán (PENDING/PAYMENT_FAILED), hoàn lại tồn kho' })
  @ApiOkResponse({ type: OrderSummaryDto, description: 'Đơn đã chuyển sang CANCELLED' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng của bạn' })
  @ApiConflictResponse({ description: 'Đơn đã thanh toán / đã hủy hoặc bị xử lý đồng thời' })
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.cancel(user.id, id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Nhân viên quầy cập nhật trạng thái đơn (PAID → PREPARING → READY → COMPLETED)' })
  @ApiOkResponse({ type: OrderSummaryDto })
  @ApiForbiddenResponse({ description: 'Tài khoản không phải vai trò STAFF' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiConflictResponse({ description: 'Chuyển trạng thái sai quy trình hoặc xung đột khóa lạc quan' })
  advance(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.advance(user.id, id, dto.status);
  }
}
