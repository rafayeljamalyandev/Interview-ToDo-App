import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: {
      origin: '*',
      credentials: false,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    },
    logger: ['error', 'warn', 'debug', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API To Do App Documentation')
    .setDescription('API TO DO App description')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 5000);

  await app.listen(port, () => {
    console.log(`🚀 Application is running on: http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start', error);
  process.exit(1);
});
