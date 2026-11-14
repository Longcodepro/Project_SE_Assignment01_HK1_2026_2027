import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { OrderStatus, Size } from '../../generated/prisma/enums.js';
import { STAFF_STEPS, type StaffStep } from '../order-status.js';
import { TOPPING_PRICE } from '../pricing.js';

// Body của PATCH /orders/:id/status (nhân viên quầy)
export class UpdateOrderStatusDto {
  @ApiProperty({ enum: STAFF_STEPS, example: 'PREPARING' })
  @IsIn(STAFF_STEPS)
  status!: StaffStep;
}

// Kết quả POST /orders
export class OrderSummaryDto {
  @ApiProperty({ example: 'ord_a1b2c3d4e5' })
  id!: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status!: string;

  @ApiProperty({ example: 71000, description: 'VND phải trả, do server tính, đã trừ discount' })
  total!: number;

  @ApiProperty({ example: 0, description: 'VND được giảm nhờ mã giảm giá' })
  discount!: number;

  @ApiProperty({ example: null, nullable: true, type: String, description: 'Mã giảm giá đã áp' })
  promoCode!: string | null;
}

export class OrderHistoryItemDto {
  @ApiProperty({ example: 1 })
  productId!: number;

  @ApiProperty({ example: 'Cà phê sữa' })
  productName!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ enum: Size, example: Size.M })
  size!: string;

  @ApiProperty({ enum: Object.keys(TOPPING_PRICE), isArray: true, example: ['tran-chau'] })
  toppings!: string[];

  @ApiProperty({ example: 42000, description: 'VND, giá 1 ly đã gồm size + topping' })
  unitPrice!: number;
}

// Một phần tử của GET /orders/me
export class OrderHistoryDto extends OrderSummaryDto {
  @ApiProperty({ example: '2026-11-06T13:55:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: OrderHistoryItemDto, isArray: true })
  items!: OrderHistoryItemDto[];
}
