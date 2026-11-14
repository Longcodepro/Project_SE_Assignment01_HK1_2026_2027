import { BadRequestException } from '@nestjs/common';
import { discountFor } from './promo.js';

describe('Mã giảm giá', () => {
  it.each([
    ['BREW10', 84000, 8400], // 10%
    ['brew10 ', 84000, 8400], // không phân biệt hoa thường, bỏ khoảng trắng
    ['BREW10', 500000, 20000], // chạm trần 20.000đ
    ['GIAM15K', 50000, 15000], // đúng ngưỡng tối thiểu
  ])('%s trên đơn %iđ giảm %iđ', (code, subtotal, expected) => {
    expect(discountFor(code, subtotal).discount).toBe(expected);
  });

  it('trả mã đã chuẩn hóa để lưu vào đơn', () => {
    expect(discountFor(' brew10', 10000).code).toBe('BREW10');
  });

  it('400 khi mã không tồn tại', () => {
    expect(() => discountFor('KHONGCO', 84000)).toThrow(BadRequestException);
  });

  it('400 khi đơn chưa đủ giá trị tối thiểu', () => {
    expect(() => discountFor('GIAM15K', 49999)).toThrow(/từ 50.000đ/);
  });
});
