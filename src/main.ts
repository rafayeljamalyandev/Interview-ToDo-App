import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { env } from 'process';

const appName = 'main';
const logger = new Logger(`main.${appName}.bootstrap`);
const port = env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Todo')
    .setDescription('API service for Todo.')
    .setVersion('1.0')
    .addTag('interview-todo')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    swaggerOptions: { persistAuthorization: true },
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  await app.listen(port, () => {
    logger.log(`--------- Application starts ---------`);
    logger.log(`--------------------------------------`);
    logger.log(`Listening on port: ${port} for the ${appName} app`);
  });
}
bootstrap();
