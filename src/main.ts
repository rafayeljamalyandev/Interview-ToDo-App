import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './shared/middlewares/exception.filter';
import { ConfigService } from '@nestjs/config';
import { CustomValidationPipe } from './shared/middlewares/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new CustomValidationPipe({ transform: true, whitelist: true }),
  );
  app.useGlobalFilters(new AllExceptionFilter());
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app
    .listen(port)
    .then(() => {
      console.log(`Server started listening on port ${port}`);
    })
    .catch((err) => {
      console.log(`Error on running server on port ${port}`, err);
    });
}
bootstrap();
