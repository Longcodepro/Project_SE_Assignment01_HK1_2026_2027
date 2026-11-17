// =============================================================================
// MAIN ENTRYPOINT - KHỞI CHẠY BACKEND NESTJS (ASSIGNMENT 1)
// =============================================================================

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { setupSwagger } from './swagger.js';
import { createValidationPipe } from './common/validation.js';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  // 1. Khởi tạo ứng dụng NestJS từ AppModule
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // 2. Middleware ghi log HTTP: đo thời gian phản hồi (duration) và mã trạng thái
  const httpLogger = new Logger('HTTP');
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;
      if (statusCode >= 500) {
        httpLogger.error(message);
      } else if (statusCode >= 400) {
        httpLogger.warn(message);
      } else {
        httpLogger.log(message);
      }
    });
    next();
  });

  // 3. Thiết lập tài liệu API tự động (Swagger UI tại /docs và OpenAPI JSON tại /docs-json)
  setupSwagger(app);

  // 4. Kích hoạt ValidationPipe toàn cục: tự động kiểm tra DTO và loại bỏ các trường lạ
  app.useGlobalPipes(createValidationPipe());

  // 5. Cấu hình bảo mật chia sẻ tài nguyên (CORS) cho phép frontend kết nối
  const rawFrontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4001';
  const allowedOrigins = rawFrontendUrl.split(',').map((u) => u.trim());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  });

  // 6. Lắng nghe tại cổng PORT (mặc định cổng 4000)
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  Logger.log(`Ứng dụng BrewLite Backend đang chạy tại http://localhost:${port}`, 'Bootstrap');
}

await bootstrap();
