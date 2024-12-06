import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('auth_service.port');
  const logger = app.get(Logger);
  await app.listen(PORT, () => {
    logger.log(`Server started listening on port ${PORT}`);
  });
}
bootstrap();
