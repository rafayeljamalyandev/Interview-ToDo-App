import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';

async function main() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.use('/todos', AuthMiddleware);

  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}

main();
