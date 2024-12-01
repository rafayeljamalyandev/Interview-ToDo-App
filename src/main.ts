import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './shared/middlewares/exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(new AllExceptionFilter());
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  app
    .listen(port)
    .then(() => {
      console.log(`Server started listening on port ${port}`);
    })
    .catch((err) => {
      console.log(`Error on running server on port ${port}`, err);
    });
}
bootstrap();
