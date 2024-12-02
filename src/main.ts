import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {GlobalExceptionFilter} from "./frameworks/global-exeption/global-exception-filter";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  const config = new DocumentBuilder()
      .setTitle('Todo API')
      .setDescription('ToDo API description')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000, () => {
    console.log('Server started listening on port 3000');
  });
}
bootstrap();
