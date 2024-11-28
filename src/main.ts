import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip out properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if there are extra properties
      exceptionFactory: (errors) => {
        const errorMessage =
          errors[0]?.constraints[Object.keys(errors[0].constraints)[0]];

        return new BadRequestException(errorMessage);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}
bootstrap();
