import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createValidationPipe } from '../common/validation.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

const item = { productId: 1, quantity: 2, size: 'M', toppings: ['tran-chau'] };

async function setup(
  findManyOrders = vi.fn().mockResolvedValue([]),
  findUnique = vi.fn().mockResolvedValue(null),
) {
  const create = vi.fn().mockImplementation(({ data }) =>
    Promise.resolve({ id: data.id, status: 'PENDING', total: data.total }),
  );
  const findMany = vi.fn().mockResolvedValue([{ id: 1, price: 29000 }]);
  // count = 1: còn đủ hàng; test hết hàng đổi thành 0
  const productUpdateMany = vi.fn().mockResolvedValue({ count: 1 });
  const prisma = {
    product: { findMany, updateMany: productUpdateMany, update: vi.fn().mockResolvedValue({}) },
    order: {
      create,
      findMany: findManyOrders,
      findUnique,
      findFirst: vi.fn().mockResolvedValue(null),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    user: { findUnique: vi.fn().mockResolvedValue({ role: 'CUSTOMER' }) },
    $transaction: (fn: (tx: unknown) => unknown) => fn(prisma),
  };
  const moduleRef = await Test.createTestingModule({
    controllers: [OrdersController],
    providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
  })
    // guard thật được test riêng ở auth.controller.spec.ts
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
  return { app, create, findManyOrders, findUnique, productUpdateMany, prisma };
}

describe('POST /orders/:id/cancel', () => {
  const mine = {
    id: 'ord_1', userId: 7, status: 'PENDING', total: 84000, version: 2,
    items: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }],
  };

  it('hủy đơn PENDING: đổi CANCELLED có khoá lạc quan và hoàn kho từng món', async () => {
    const { app, prisma } = await setup();
    prisma.order.findFirst.mockResolvedValue(mine);
    const res = await request(app.getHttpServer()).post('/orders/ord_1/cancel').expect(200);
    expect(res.body).toEqual({ id: 'ord_1', status: 'CANCELLED', total: 84000 });
    expect(prisma.order.findFirst.mock.calls[0][0].where).toEqual({ id: 'ord_1', userId: 7 });
    expect(prisma.order.updateMany.mock.calls[0][0]).toEqual({
      where: { id: 'ord_1', version: 2 },
      data: { status: 'CANCELLED', version: { increment: 1 } },
    });
    expect(prisma.product.update.mock.calls.map((c: any) => c[0])).toEqual([
      { where: { id: 1 }, data: { stock: { increment: 2 } } },
      { where: { id: 3 }, data: { stock: { increment: 1 } } },
    ]);
    await app.close();
  });

  it('409 khi đơn đã PAID, không hoàn kho', async () => {
    const { app, prisma } = await setup();
    prisma.order.findFirst.mockResolvedValue({ ...mine, status: 'PAID' });
    await request(app.getHttpServer()).post('/orders/ord_1/cancel').expect(409);
    expect(prisma.product.update).not.toHaveBeenCalled();
    await app.close();
  });

  it('404 khi đơn không phải của mình', async () => {
    const { app } = await setup();
    await request(app.getHttpServer()).post('/orders/ord_x/cancel').expect(404);
    await app.close();
  });

  it('409 khi yêu cầu khác vừa sửa đơn (version đổi), không hoàn kho', async () => {
    const { app, prisma } = await setup();
    prisma.order.findFirst.mockResolvedValue(mine);
    prisma.order.updateMany.mockResolvedValue({ count: 0 });
    await request(app.getHttpServer()).post('/orders/ord_1/cancel').expect(409);
    expect(prisma.product.update).not.toHaveBeenCalled();
    await app.close();
  });
});

describe('Nhân viên quầy', () => {
  const paid = { id: 'ord_1', userId: 9, status: 'PAID', total: 84000, version: 4 };

  it('403 khi khách thường gọi PATCH /orders/:id/status hoặc GET /orders/queue', async () => {
    const { app, prisma } = await setup();
    await request(app.getHttpServer()).patch('/orders/ord_1/status').send({ status: 'PREPARING' }).expect(403);
    await request(app.getHttpServer()).get('/orders/queue').expect(403);
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
    await app.close();
  });

  it('STAFF chuyển PAID → PREPARING có khoá lạc quan', async () => {
    const { app, prisma, findUnique } = await setup();
    prisma.user.findUnique.mockResolvedValue({ role: 'STAFF' });
    findUnique.mockResolvedValue(paid);
    const res = await request(app.getHttpServer())
      .patch('/orders/ord_1/status')
      .send({ status: 'PREPARING' })
      .expect(200);
    expect(res.body).toEqual({ id: 'ord_1', status: 'PREPARING', total: 84000 });
    expect(prisma.order.updateMany.mock.calls[0][0]).toEqual({
      where: { id: 'ord_1', version: 4 },
      data: { status: 'PREPARING', version: { increment: 1 } },
    });
    await app.close();
  });

  it('STAFF nhảy cóc PAID → COMPLETED bị 409', async () => {
    const { app, prisma, findUnique } = await setup();
    prisma.user.findUnique.mockResolvedValue({ role: 'STAFF' });
    findUnique.mockResolvedValue(paid);
    await request(app.getHttpServer()).patch('/orders/ord_1/status').send({ status: 'COMPLETED' }).expect(409);
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
    await app.close();
  });

  it.each(['PAID', 'CANCELLED', 'PENDING', 'xyz'])('400 khi nhân viên gửi status %s', async (status) => {
    const { app, prisma } = await setup();
    prisma.user.findUnique.mockResolvedValue({ role: 'STAFF' });
    await request(app.getHttpServer()).patch('/orders/ord_1/status').send({ status }).expect(400);
    await app.close();
  });

  it('GET /orders/queue trả đơn PAID/PREPARING/READY, cũ nhất trước', async () => {
    const { app, prisma, findManyOrders } = await setup();
    prisma.user.findUnique.mockResolvedValue({ role: 'STAFF' });
    await request(app.getHttpServer()).get('/orders/queue').expect(200);
    expect(findManyOrders.mock.calls[0][0]).toMatchObject({
      where: { status: { in: ['PAID', 'PREPARING', 'READY'] } },
      orderBy: { createdAt: 'asc' },
    });
    await app.close();
  });
});

describe('POST /orders', () => {
  it('lưu đơn PENDING, tính tổng ở server và trả mã đơn', async () => {
    const { app, create } = await setup();

    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [item] })
      .expect(201);

    // 2 × (29000 + size M 5000 + trân châu 8000)
    expect(res.body).toMatchObject({ status: 'PENDING', total: 84000 });
    expect(res.body.id).toMatch(/^ord_/);
    expect(create.mock.calls[0][0].data.userId).toBe(7);
    expect(create.mock.calls[0][0].data.items.create[0].unitPrice).toBe(42000);
    await app.close();
  });

  it.each([
    ['giỏ rỗng', { items: [] }],
    ['thiếu items', {}],
    ['số lượng 0', { items: [{ ...item, quantity: 0 }] }],
    ['size lạ', { items: [{ ...item, size: 'XL' }] }],
    ['topping lạ', { items: [{ ...item, toppings: ['la'] }] }],
    ['trường thừa (giá do client gửi)', { items: [{ ...item, price: 1 }] }],
  ])('400 khi %s', async (_name, body) => {
    const { app, create } = await setup();

    const res = await request(app.getHttpServer())
      .post('/orders')
      .send(body)
      .expect(400);

    expect(Array.isArray(res.body.message)).toBe(true);
    expect(create).not.toHaveBeenCalled();
    await app.close();
  });

  it('400 khi sản phẩm không tồn tại', async () => {
    const { app, create } = await setup();

    await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [{ ...item, productId: 99 }] })
      .expect(400);

    expect(create).not.toHaveBeenCalled();
    await app.close();
  });
});

describe('POST /orders với mã giảm giá', () => {
  it('áp BREW10: lưu mã và số tiền giảm, total là số phải trả', async () => {
    const { app, create } = await setup();
    await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [item], promoCode: 'brew10' })
      .expect(201);
    // tạm tính 84.000đ, giảm 10% = 8.400đ
    expect(create.mock.calls[0][0].data).toMatchObject({
      total: 75600,
      discount: 8400,
      promoCode: 'BREW10',
    });
    await app.close();
  });

  it('không gửi mã thì discount 0', async () => {
    const { app, create } = await setup();
    await request(app.getHttpServer()).post('/orders').send({ items: [item] }).expect(201);
    expect(create.mock.calls[0][0].data).toMatchObject({ total: 84000, discount: 0, promoCode: undefined });
    await app.close();
  });

  it('400 khi mã sai, không trừ kho và không tạo đơn', async () => {
    const { app, create, productUpdateMany } = await setup();
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [item], promoCode: 'SAI' })
      .expect(400);
    expect(res.body.message).toMatch(/không hợp lệ/);
    expect(productUpdateMany).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    await app.close();
  });
});

describe('POST /orders trừ tồn kho', () => {
  it('trừ kho theo tổng số ly của từng sản phẩm, chỉ trừ khi còn đủ', async () => {
    const { app, productUpdateMany } = await setup();
    await request(app.getHttpServer())
      .post('/orders')
      .send({ items: [item, { ...item, size: 'L', quantity: 3 }] })
      .expect(201);
    // 2 ly size M + 3 ly size L cùng sản phẩm 1 → trừ một lần 5 ly
    expect(productUpdateMany).toHaveBeenCalledTimes(1);
    expect(productUpdateMany.mock.calls[0][0]).toEqual({
      where: { id: 1, stock: { gte: 5 } },
      data: { stock: { decrement: 5 } },
    });
    await app.close();
  });

  it('409 khi không đủ hàng, không tạo đơn', async () => {
    const { app, create, productUpdateMany } = await setup();
    productUpdateMany.mockResolvedValueOnce({ count: 0 });
    const res = await request(app.getHttpServer()).post('/orders').send({ items: [item] }).expect(409);
    expect(res.body.message).toMatch(/không đủ hàng/);
    expect(create).not.toHaveBeenCalled();
    await app.close();
  });
});

describe('GET /orders/me', () => {
  it('trả lịch sử đơn của người dùng đang đăng nhập, đơn mới nhất trước', async () => {
    const createdAt = new Date('2026-10-26T03:00:00.000Z');
    const findManyOrders = vi.fn().mockResolvedValue([
      {
        id: 'ord_1',
        status: 'PAID',
        total: 84000,
        createdAt,
        items: [
          {
            productId: 1,
            quantity: 2,
            size: 'M',
            toppings: ['tran-chau'],
            unitPrice: 42000,
            product: { name: 'Cà phê sữa' },
          },
        ],
      },
    ]);
    const { app } = await setup(findManyOrders);

    const res = await request(app.getHttpServer()).get('/orders/me').expect(200);

    expect(findManyOrders.mock.calls[0][0]).toMatchObject({
      where: { userId: 7 },
      orderBy: { createdAt: 'desc' },
    });
    expect(res.body).toEqual([
      {
        id: 'ord_1',
        status: 'PAID',
        total: 84000,
        createdAt: createdAt.toISOString(),
        items: [
          {
            productId: 1,
            productName: 'Cà phê sữa',
            quantity: 2,
            size: 'M',
            toppings: ['tran-chau'],
            unitPrice: 42000,
          },
        ],
      },
    ]);
    await app.close();
  });

  it('chưa có đơn thì trả mảng rỗng', async () => {
    const { app } = await setup();
    const res = await request(app.getHttpServer()).get('/orders/me').expect(200);
    expect(res.body).toEqual([]);
    await app.close();
  });
});

describe('POST /orders với Idempotency-Key', () => {
  const body = { items: [item] };
  const existing = { id: 'ord_old', status: 'PENDING', total: 84000 };

  it('lần đầu: lưu key cùng đơn', async () => {
    const { app, create, findUnique } = await setup();
    await request(app.getHttpServer()).post('/orders').set('Idempotency-Key', 'k-1').send(body).expect(201);
    expect(findUnique.mock.calls[0][0].where).toEqual({
      userId_idempotencyKey: { userId: 7, idempotencyKey: 'k-1' },
    });
    expect(create.mock.calls[0][0].data.idempotencyKey).toBe('k-1');
    await app.close();
  });

  it('gửi lại cùng key: trả đơn cũ, không tạo đơn mới', async () => {
    const { app, create } = await setup(undefined, vi.fn().mockResolvedValue(existing));
    const res = await request(app.getHttpServer()).post('/orders').set('Idempotency-Key', 'k-1').send(body).expect(201);
    expect(res.body).toEqual(existing);
    expect(create).not.toHaveBeenCalled();
    await app.close();
  });

  it('hai yêu cầu cùng key đến cùng lúc: bên thua trả đơn của bên thắng', async () => {
    const findUnique = vi.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(existing);
    const { app, create } = await setup(undefined, findUnique);
    create.mockRejectedValueOnce({ code: 'P2002' });
    const res = await request(app.getHttpServer()).post('/orders').set('Idempotency-Key', 'k-1').send(body).expect(201);
    expect(res.body).toEqual(existing);
    await app.close();
  });

  it('không có header thì không tra cứu key', async () => {
    const { app, findUnique, create } = await setup();
    await request(app.getHttpServer()).post('/orders').send(body).expect(201);
    expect(findUnique).not.toHaveBeenCalled();
    expect(create.mock.calls[0][0].data.idempotencyKey).toBeUndefined();
    await app.close();
  });

  it('400 khi key sai định dạng', async () => {
    const { app, create } = await setup();
    await request(app.getHttpServer()).post('/orders').set('Idempotency-Key', 'sai dinh dang!').send(body).expect(400);
    expect(create).not.toHaveBeenCalled();
    await app.close();
  });
});
