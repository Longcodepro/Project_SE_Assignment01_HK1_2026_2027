// =============================================================================
// PRODUCTS CONTROLLER - CÁC ENDPOINT MENU SẢN PHẨM
// =============================================================================

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto.js';
import { ProductsService } from './products.service.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm trên menu (sắp theo ID tăng dần)' })
  @ApiOkResponse({
    type: ProductDto,
    isArray: true,
    description: 'Danh sách các món đồ uống sẵn sàng phục vụ',
  })
  findAll() {
    return this.productsService.findAll();
  }
}
