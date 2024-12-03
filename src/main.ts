import { ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
  //global validation enabled
  app.useGlobalPipes(new ValidationPipe);
  await app.listen(5000, () => {
    console.log('Server started listening on port 5000');
  });
}
bootstrap();
