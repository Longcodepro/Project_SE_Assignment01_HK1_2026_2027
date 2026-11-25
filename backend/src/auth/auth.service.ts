// =============================================================================
// AUTH SERVICE - NGHIỆP VỤ ĐĂNG KÝ VÀ ĐĂNG NHẬP
// =============================================================================

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LoginDto, RegisterDto } from './dto/auth.dto.js';

// Giá trị băm giả: Dùng để chạy bcrypt.compare ngay cả khi email không tồn tại trong DB,
// nhằm đảm bảo thời gian phản hồi (response time) không đổi, ngăn chặn tấn công Timing Attack
const DUMMY_HASH = bcrypt.hashSync('khong-ton-tai', 10);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Đăng ký tài khoản khách hàng mới:
   * - Băm mật khẩu bằng bcrypt với salt rounds = 10.
   * - Lưu vào DB, chặn trùng email (bắt mã lỗi P2002 của Prisma -> 409 Conflict).
   * - Không bao giờ trả passwordHash ra ngoài.
   */
  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.user.create({
        data: { email: dto.email, passwordHash, name: dto.name },
        select: { id: true, email: true, name: true },
      });
    } catch (e: any) {
      if (e?.code === 'P2002') throw new ConflictException('Email đã được đăng ký');
      throw e;
    }
  }

  /**
   * Đăng nhập:
   * - Tìm người dùng theo email.
   * - So khớp mật khẩu với hash đã lưu.
   * - Ký tạo JWT token chứa sub (userId) và email.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const ok = await bcrypt.compare(dto.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
