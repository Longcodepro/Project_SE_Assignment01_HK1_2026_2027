import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createValidationPipe } from '../common/validation.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

const item = { productId: 1, quantity: 2, size: 'M', toppings: ['tran-chau'] };

async function setup() {
  const create = vi.fn().mockImplementation(({ data }) =>
    Promise.resolve({ id: data.id, status: 'PENDING', total: data.total }),
  );
  const findMany = vi.fn().mockResolvedValue([{ id: 1, price: 29000 }]);
  const moduleRef = await Test.createTestingModule({
    controllers: [OrdersController],
    providers: [
      OrdersService,
      {
        provide: PrismaService,
        useValue: { product: { findMany }, order: { create } },
      },
    ],
  }).compile();
  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(createValidationPipe());
  await app.init();
  return { app, create };
}

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
