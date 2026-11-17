// =============================================================================
// SWAGGER OPENAPI CONFIGURATION
// Thiết lập giao diện tài liệu API tương tác tại /docs và OpenAPI JSON tại /docs-json
// =============================================================================

import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('BrewLite API')
  .setDescription('API đặt cà phê không dùng tiền mặt (Assignment 1). Hợp đồng chi tiết: docs/API-CONTRACT.md')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

// UI xem tại http://localhost:4000/docs, JSON (để nạp vào Postman) tại http://localhost:4000/docs-json
export function setupSwagger(app: INestApplication) {
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));
}
