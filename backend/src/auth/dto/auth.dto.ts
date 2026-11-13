import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class LoginDto {
  @ApiProperty({ example: 'a@example.com' })
  @Transform(normalizeEmail)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'matkhau123', maxLength: 72 })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string;
}

// Không extends LoginDto: class-validator bỏ decorator của lớp cha khi lớp con
// khai báo lại cùng thuộc tính, nên giới hạn 72 ký tự sẽ mất.
export class RegisterDto {
  @ApiProperty({ example: 'a@example.com' })
  @Transform(normalizeEmail)
  @IsEmail()
  email!: string;

  // bcrypt chỉ băm 72 byte đầu nên chặn mật khẩu dài hơn
  @ApiProperty({ example: 'matkhau123', minLength: 6, maxLength: 72 })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'a@example.com' })
  email!: string;

  @ApiProperty({ example: 'Nguyễn Văn A', nullable: true, type: String })
  name!: string | null;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT, gửi kèm header Authorization: Bearer <accessToken>',
  })
  accessToken!: string;
}
