import { Test } from '@nestjs/testing';
import request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { createValidationPipe } from '../common/validation.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MockPaymentGateway } from './mock-gateway.js';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';

async function setup(order: object | null, updatedCount = 1) {
  const orderUpdateMany = vi.fn().mockResolvedValue({ count: updatedCount });
  const paymentCreate = vi
    .fn()
    .mockImplementation(({ data }) => Promise.resolve({ id: 11, ...data }));
  const orderFindFirst = vi.fn().mockResolvedValue(order);
  const tx = { order: { updateMany: orderUpdateMany }, payment: { create: paymentCreate } };
  const prisma = {
    order: { findFirst: orderFindFirst },
    $transaction: (fn: (t: typeof tx) => unknown) => fn(tx),
  };
  const moduleRef = await Test.createTestingModule({
    controllers: [PaymentsController],
    providers: [PaymentsService, MockPaymentGateway, { provide: PrismaService, useValue: prisma }],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (ctx: any) => {
        ctx.switchToHttp().getRequest().user = { id: 7, email: 'a@b.c' };
        return true;
      },
    })
    .compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(createValidationPipe());
  await app.init();
  return { app, orderFindFirst, orderUpdateMany, paymentCreate, http: () => request(app.getHttpServer()) };
}

const pending = { id: 'ord_1', userId: 7, status: 'PENDING', total: 84000 };

describe('POST /payments', () => {
  it('Ví: đơn chuyển PAID và lưu lần thanh toán SUCCESS với số tiền của đơn', async () => {
    const { app, http, orderUpdateMany, paymentCreate, orderFindFirst } = await setup(pending);

    const res = await http().post('/payments').send({ orderId: 'ord_1', method: 'WALLET' }).expect(201);

    expect(res.body).toMatchObject({ orderId: 'ord_1', status: 'PAID', method: 'WALLET', amount: 84000 });
    expect(orderFindFirst).toHaveBeenCalledWith({ where: { id: 'ord_1', userId: 7 } });
    expect(orderUpdateMany.mock.calls[0][0].data).toEqual({ status: 'PAID' });
    expect(paymentCreate.mock.calls[0][0].data).toMatchObject({ status: 'SUCCESS', amount: 84000 });
    await app.close();
  });

  it('Thẻ hợp lệ: PAID', async () => {
    const { app, http } = await setup(pending);
    const res = await http().post('/payments').send({ orderId: 'ord_1', method: 'CARD', cardNumber: '4111111111111111' }).expect(201);
    expect(res.body.status).toBe('PAID');
    await app.close();
  });

  it('Thẻ bị từ chối (đuôi 0000): đơn chuyển PAYMENT_FAILED kèm lý do', async () => {
    const { app, http, orderUpdateMany, paymentCreate } = await setup(pending);

    const res = await http().post('/payments').send({ orderId: 'ord_1', method: 'CARD', cardNumber: '4111111111110000' }).expect(201);

    expect(res.body).toMatchObject({ status: 'PAYMENT_FAILED', reason: 'Thẻ bị từ chối' });
    expect(orderUpdateMany.mock.calls[0][0].data).toEqual({ status: 'PAYMENT_FAILED' });
    expect(paymentCreate.mock.calls[0][0].data.status).toBe('FAILED');
    await app.close();
  });

  it('Ví không đủ số dư khi đơn trên 500.000đ', async () => {
    const { app, http } = await setup({ ...pending, total: 600000 });
    const res = await http().post('/payments').send({ orderId: 'ord_1', method: 'WALLET' }).expect(201);
    expect(res.body).toMatchObject({ status: 'PAYMENT_FAILED', reason: 'Số dư ví không đủ' });
    await app.close();
  });

  it('thử lại được khi đơn đang PAYMENT_FAILED', async () => {
    const { app, http } = await setup({ ...pending, status: 'PAYMENT_FAILED' });
    const res = await http().post('/payments').send({ orderId: 'ord_1', method: 'WALLET' }).expect(201);
    expect(res.body.status).toBe('PAID');
    await app.close();
  });

  it('404 khi đơn không tồn tại hoặc của người khác', async () => {
    const { app, http, paymentCreate } = await setup(null);
    await http().post('/payments').send({ orderId: 'ord_x', method: 'WALLET' }).expect(404);
    expect(paymentCreate).not.toHaveBeenCalled();
    await app.close();
  });

  it('409 khi đơn đã PAID, không gọi cổng thanh toán', async () => {
    const { app, http, paymentCreate } = await setup({ ...pending, status: 'PAID' });
    await http().post('/payments').send({ orderId: 'ord_1', method: 'WALLET' }).expect(409);
    expect(paymentCreate).not.toHaveBeenCalled();
    await app.close();
  });

  it('409 khi hai yêu cầu cùng thanh toán một đơn (updateMany không khớp dòng nào)', async () => {
    const { app, http, paymentCreate } = await setup(pending, 0);
    await http().post('/payments').send({ orderId: 'ord_1', method: 'WALLET' }).expect(409);
    expect(paymentCreate).not.toHaveBeenCalled();
    await app.close();
  });

  it.each([
    ['thiếu orderId', { method: 'WALLET' }],
    ['phương thức lạ', { orderId: 'ord_1', method: 'CASH' }],
    ['trả thẻ mà thiếu số thẻ', { orderId: 'ord_1', method: 'CARD' }],
    ['số thẻ không phải số', { orderId: 'ord_1', method: 'CARD', cardNumber: 'abcd' }],
    ['client gửi số tiền', { orderId: 'ord_1', method: 'WALLET', amount: 1 }],
  ])('400 khi %s', async (_n, body) => {
    const { app, http, orderFindFirst } = await setup(pending);
    await http().post('/payments').send(body).expect(400);
    expect(orderFindFirst).not.toHaveBeenCalled();
    await app.close();
  });
});
