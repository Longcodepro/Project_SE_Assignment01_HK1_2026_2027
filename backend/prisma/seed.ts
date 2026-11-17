import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const products = [
  {
    id: 1,
    name: 'Cà phê sữa',
    price: 29000,
    imageUrl: '/images/ca-phe-sua.svg',
    stock: 100,
  },
  {
    id: 2,
    name: 'Cà phê đen',
    price: 25000,
    imageUrl: '/images/ca-phe-den.svg',
    stock: 100,
  },
  {
    id: 3,
    name: 'Bạc xỉu',
    price: 32000,
    imageUrl: '/images/bac-xiu.svg',
    stock: 100,
  },
  {
    id: 4,
    name: 'Trà đào cam sả',
    price: 39000,
    imageUrl: '/images/tra-dao-cam-sa.svg',
    stock: 100,
  },
  {
    id: 5,
    name: 'Trà sữa trân châu',
    price: 35000,
    imageUrl: '/images/tra-sua-tran-chau.svg',
    stock: 100,
  },
  {
    id: 6,
    name: 'Matcha latte',
    price: 45000,
    imageUrl: '/images/matcha-latte.svg',
    stock: 100,
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// 1. Seed danh sách sản phẩm mẫu (upsert để không bị lỗi trùng lặp khi chạy lại)
for (const p of products) {
  await prisma.product.upsert({ where: { id: p.id }, update: p, create: p });
}

// 2. Seed tài khoản Nhân viên quầy (STAFF) phục vụ test duyệt đơn hàng
const staffEmail = 'staff@brewlite.vn';
const staffPassword = process.env.SEED_STAFF_PASSWORD || 'matkhau123';
const passwordHash = await bcrypt.hash(staffPassword, 10);

await prisma.user.upsert({
  where: { email: staffEmail },
  update: { role: 'STAFF' },
  create: {
    email: staffEmail,
    passwordHash,
    name: 'Nhân Viên Quầy',
    role: 'STAFF',
  },
});

await prisma.$disconnect();
