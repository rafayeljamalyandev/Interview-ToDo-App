import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });

  app.enableShutdownHooks();
}

bootstrap();
