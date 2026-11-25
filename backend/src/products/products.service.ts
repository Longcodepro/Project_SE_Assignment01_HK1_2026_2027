// =============================================================================
// PRODUCTS SERVICE - TRUY VẤN DANH MỤC SẢN PHẨM
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy toàn bộ danh sách sản phẩm trên menu:
   * - Sắp xếp theo ID tăng dần để giữ thứ tự menu hiển thị cố định.
   * - Bao gồm: id, name, price (giá size S), imageUrl, stock (tồn kho).
   */
  findAll() {
    return this.prisma.product.findMany({ orderBy: { id: 'asc' } });
  }
}
