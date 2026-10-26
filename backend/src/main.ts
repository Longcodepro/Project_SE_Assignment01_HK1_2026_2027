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
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4001',
  });
  await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
