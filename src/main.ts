import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port, () => {
    console.log('Server started on port ' + port);
  });
}
bootstrap();
