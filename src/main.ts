import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common/prisma/prisma-client-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({ origin: configService.get<string>('BASE_URL') });
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}
bootstrap();
