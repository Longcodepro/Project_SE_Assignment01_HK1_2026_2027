// =============================================================================
// AUTH CONTROLLER - CÁC ENDPOINT XÁC THỰC & ĐĂNG NHẬP
// =============================================================================

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto/auth.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng mới' })
  @ApiCreatedResponse({ type: RegisterResponseDto, description: 'Đăng ký thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ (mật khẩu quá ngắn hoặc sai định dạng email)' })
  @ApiConflictResponse({ description: 'Email đã được đăng ký từ trước' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập vào hệ thống, nhận chuỗi JWT Access Token' })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Đăng nhập thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu yêu cầu không hợp lệ' })
  @ApiUnauthorizedResponse({ description: 'Email hoặc mật khẩu không đúng' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
}
