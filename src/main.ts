import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {GlobalExceptionFilter} from "./frameworks/global-exeption/global-exception-filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}
bootstrap();
