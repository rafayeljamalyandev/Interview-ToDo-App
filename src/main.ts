import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const cors = {
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };

  app.use(cookieParser());

  app.enableCors(cors);

  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}

bootstrap();
