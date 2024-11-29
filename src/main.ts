import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Create Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The Interview-ToDo-App API description')
    .setVersion('1.0')
    .addServer('/v1', 'Version 1')
    .addBearerAuth()
    .build();

  // Generate Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('api-docs', app, document);

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
