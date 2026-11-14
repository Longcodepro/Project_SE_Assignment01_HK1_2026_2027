-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 100;

-- Chốt chặn cuối ở DB: tồn kho không bao giờ âm, kể cả khi code có lỗi
ALTER TABLE "Product" ADD CONSTRAINT "Product_stock_khong_am" CHECK ("stock" >= 0);
