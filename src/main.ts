import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseSuccessInterceptor } from './middlewares/interceptors/response.success.interceptor';
import { ResponseErrorInterceptor } from './middlewares/interceptors/response.error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  app.useGlobalFilters(new ResponseErrorInterceptor());
  app.setGlobalPrefix('');
  app.enableCors();

  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}
bootstrap();
