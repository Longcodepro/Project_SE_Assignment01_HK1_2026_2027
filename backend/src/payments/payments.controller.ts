import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, type AuthUser } from '../auth/jwt-auth.guard.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  pay(@CurrentUser() user: AuthUser, @Body() dto: CreatePaymentDto) {
    return this.payments.pay(user.id, dto);
  }
}
