import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until logger is ready
  });

  // Enable structured logging with Pino
  app.useLogger(app.get(Logger));

  // Enable validation and whitelist (strip) non-DTO properties
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Enable cookie parsing middleware
  app.use(cookieParser());

  // Get port from config and start server
  const port = app.get(ConfigService).getOrThrow('PORT');
  await app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
  });
}
bootstrap();
