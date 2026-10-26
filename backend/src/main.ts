import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger.js';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  setupSwagger(app);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4001',
  });
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
