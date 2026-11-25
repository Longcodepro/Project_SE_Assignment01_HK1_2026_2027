// =============================================================================
// JWT AUTH GUARD & CURRENT USER DECORATOR
// Bảo vệ các endpoint yêu cầu đăng nhập và trích xuất thông tin người dùng từ Token
// =============================================================================

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Cấu trúc dữ liệu người dùng sau khi giải mã token
export type AuthUser = { id: number; email: string };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const [type, token] = (req.headers.authorization ?? '').split(' ');
    
    // Bắt buộc phải có header Authorization theo chuẩn "Bearer <token>"
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Thiếu token đăng nhập');
    }

    try {
      // Giải mã và xác minh tính toàn vẹn của chữ ký số JWT
      const payload = await this.jwt.verifyAsync(token);
      req.user = { id: payload.sub, email: payload.email } satisfies AuthUser;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
    return true;
  }
}

/**
 * Custom Decorator: @CurrentUser()
 * Trích xuất đối tượng AuthUser đã được JwtAuthGuard gán vào request.
 * Sử dụng trong controller: myMethod(@CurrentUser() user: AuthUser)
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
