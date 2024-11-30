import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Create a logger instance

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convert payloads to DTO instances
      whitelist: true, // Get rid of properties that are not in the DTO
      forbidNonWhitelisted: false, // Throw error if there are extra properties
      exceptionFactory: (errors) => {
        const errorMessage =
          errors[0]?.constraints[Object.keys(errors[0].constraints)[0]];

        return new BadRequestException(errorMessage);
      },
      stopAtFirstError: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for managing tasks efficiently')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Provide a valid JWT token to authenticate',
        in: 'header',
      },
      'Access-Token', // Reference name for @ApiBearerAuth() in controllers
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `Swagger documentation is available at: http://localhost:${port}/api-docs`,
  );
}

bootstrap();
