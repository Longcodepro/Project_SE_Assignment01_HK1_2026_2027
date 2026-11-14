import { Body, Controller, Get, Headers, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
import { OrderHistoryDto, OrderSummaryDto, UpdateOrderStatusDto } from './dto/order.dto.js';
import { OrdersService } from './orders.service.js';

@ApiTags('orders')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Thiếu hoặc sai token' })
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đặt đơn; tổng tiền do server tính' })
  @ApiHeader({
    name: 'Idempotency-Key',
    required: false,
    description: '1-128 ký tự [A-Za-z0-9_-]; gửi lại cùng key trả đơn cũ, không tạo đơn mới',
  })
  @ApiCreatedResponse({ type: OrderSummaryDto })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ hoặc sản phẩm không tồn tại' })
  @ApiConflictResponse({ description: 'Sản phẩm không đủ hàng' })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateOrderDto,
    @Headers('idempotency-key') key?: string,
  ) {
    return this.ordersService.create(user.id, dto, parseIdempotencyKey(key));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lịch sử đơn của tôi, mới nhất trước' })
  @ApiOkResponse({ type: OrderHistoryDto, isArray: true })
  findMine(@CurrentUser() user: AuthUser) {
    return this.ordersService.findMine(user.id);
  }

  @Get('queue')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Nhân viên quầy: đơn PAID/PREPARING/READY, cũ nhất trước' })
  @ApiOkResponse({ type: OrderHistoryDto, isArray: true })
  @ApiForbiddenResponse({ description: 'Không phải nhân viên quầy' })
  queue(@CurrentUser() user: AuthUser) {
    return this.ordersService.queue(user.id);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khách hủy đơn chưa thanh toán (PENDING/PAYMENT_FAILED), hoàn lại tồn kho' })
  @ApiOkResponse({ type: OrderSummaryDto })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn của bạn' })
  @ApiConflictResponse({ description: 'Đơn đã thanh toán / đã hủy, hoặc bị xử lý đồng thời' })
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.cancel(user.id, id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Nhân viên quầy chuyển PAID → PREPARING → READY → COMPLETED' })
  @ApiOkResponse({ type: OrderSummaryDto })
  @ApiForbiddenResponse({ description: 'Không phải nhân viên quầy' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy đơn hàng' })
  @ApiConflictResponse({ description: 'Chuyển trạng thái không hợp lệ hoặc bị xử lý đồng thời' })
  advance(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.advance(user.id, id, dto.status);
  }
}
