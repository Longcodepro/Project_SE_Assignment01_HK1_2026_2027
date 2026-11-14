import { ConflictException } from '@nestjs/common';
import { OrdersService } from '../src/orders/orders.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

// Chạy trên PostgreSQL thật (DATABASE_URL, đã migrate) vì chỉ DB thật mới
// chứng minh được hai transaction đồng thời không cùng trừ một phần kho.
// CI dựng Postgres riêng cho bước này (.github/workflows/ci.yml, job backend-db).
describe.skipIf(!process.env.DATABASE_URL)('Tồn kho khi đặt đồng thời (Postgres thật)', () => {
  const prisma = new PrismaService();
  const orders = new OrdersService(prisma);
  const tag = `tonkho-${Date.now()}`;
  let productId: number;
  const userIds: number[] = [];

  beforeAll(async () => {
    const p = await prisma.product.create({
      data: { name: tag, price: 30000, imageUrl: '/x.svg', stock: 5 },
    });
    productId = p.id;
    for (let i = 0; i < 20; i++) {
      const u = await prisma.user.create({
        data: { email: `${tag}-${i}@test.local`, passwordHash: 'x' },
      });
      userIds.push(u.id);
    }
  });

  afterAll(async () => {
    await prisma.order.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.product.delete({ where: { id: productId } });
    await prisma.$disconnect();
  });

  it('20 khách cùng đặt 1 ly khi kho còn 5: đúng 5 đơn thành công, kho về 0, không âm', async () => {
    const results = await Promise.allSettled(
      userIds.map((userId) =>
        orders.create(userId, { items: [{ productId, quantity: 1, size: 'S' }] }),
      ),
    );

    const ok = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(ok).toHaveLength(5);
    expect(rejected).toHaveLength(15);
    for (const r of rejected) expect(r.reason).toBeInstanceOf(ConflictException);

    const p = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(p.stock).toBe(0);
    const sold = await prisma.orderItem.aggregate({
      where: { productId },
      _sum: { quantity: true },
    });
    expect(sold._sum.quantity).toBe(5);
  });

  it('đơn có một món thiếu hàng thì không trừ kho món nào (rollback cả transaction)', async () => {
    const other = await prisma.product.create({
      data: { name: `${tag}-b`, price: 30000, imageUrl: '/x.svg', stock: 3 },
    });
    await expect(
      orders.create(userIds[0], {
        items: [
          { productId: other.id, quantity: 2, size: 'S' },
          { productId, quantity: 1, size: 'S' }, // đã hết ở test trên
        ],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    const after = await prisma.product.findUniqueOrThrow({ where: { id: other.id } });
    expect(after.stock).toBe(3);
    await prisma.product.delete({ where: { id: other.id } });
  });

  it('DB chặn tồn kho âm bằng CHECK constraint', async () => {
    await expect(
      prisma.product.update({ where: { id: productId }, data: { stock: -1 } }),
    ).rejects.toThrow();
  });
});
