import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger.js';
import { createValidationPipe } from './common/validation.js';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  setupSwagger(app);
  app.useGlobalPipes(createValidationPipe());

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
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
