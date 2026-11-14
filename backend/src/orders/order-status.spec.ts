import { ConflictException } from '@nestjs/common';
import {
  ORDER_TRANSITIONS,
  assertTransition,
  canTransition,
} from './order-status.js';

const ALL = [
  'PENDING',
  'PAID',
  'PAYMENT_FAILED',
  'PREPARING',
  'READY',
  'COMPLETED',
  'CANCELLED',
] as const;
const VALID = new Set([
  'PENDING>PAID',
  'PENDING>PAYMENT_FAILED',
  'PENDING>CANCELLED',
  'PAYMENT_FAILED>PAID',
  'PAYMENT_FAILED>CANCELLED',
  'PAID>PREPARING',
  'PREPARING>READY',
  'READY>COMPLETED',
]);

describe('Order state machine', () => {
  it('trong 49 cặp trạng thái chỉ đúng 8 chuyển hợp lệ', () => {
    for (const from of ALL) {
      for (const to of ALL) {
        expect(canTransition(from, to), `${from} > ${to}`).toBe(
          VALID.has(`${from}>${to}`),
        );
      }
    }
  });

  it('COMPLETED và CANCELLED là trạng thái cuối', () => {
    expect(ORDER_TRANSITIONS.COMPLETED).toEqual([]);
    expect(ORDER_TRANSITIONS.CANCELLED).toEqual([]);
  });

  it.each([
    ['PAID', 'PENDING'],
    ['PAID', 'CANCELLED'], // đã trả tiền thì không hủy
    ['PAID', 'READY'], // không nhảy cóc bước pha chế
    ['PENDING', 'PREPARING'], // chưa trả tiền thì không pha
    ['READY', 'PREPARING'], // không lùi
    ['COMPLETED', 'CANCELLED'],
    ['CANCELLED', 'PAID'], // đơn đã hủy không thanh toán được
    ['PENDING', 'PENDING'],
  ] as const)('chặn chuyển %s → %s bằng 409', (from, to) => {
    expect(() => assertTransition(from, to)).toThrow(ConflictException);
  });

  it('đi hết luồng chính không lỗi', () => {
    const path = ['PENDING', 'PAYMENT_FAILED', 'PAID', 'PREPARING', 'READY', 'COMPLETED'] as const;
    for (let i = 1; i < path.length; i++) {
      expect(() => assertTransition(path[i - 1], path[i])).not.toThrow();
    }
  });
});
