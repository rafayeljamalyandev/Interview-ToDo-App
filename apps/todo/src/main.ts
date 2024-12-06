import { NestFactory } from '@nestjs/core';
import { TodoModule } from './todo.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(TodoModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('todo_service.port');
  const logger = app.get(Logger);
  await app.listen(PORT, () => {
    logger.log(`Server started listening on port ${PORT}`);
  });
}
bootstrap();
