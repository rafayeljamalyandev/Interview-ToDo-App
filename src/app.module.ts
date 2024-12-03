import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataServicesModule } from './services/data-services/data-services.module';
import { UserUseCasesModule } from './use-cases/user/user-use-cases.module';
import { TodoUseCasesModule } from './use-cases/todo/todo-use-cases.module';
import {  TodoController, UserController } from './controllers';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './frameworks/global-exeption/global-exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available across the entire app
      envFilePath: '.env', // Specify the path to your .env file
    }),
    DataServicesModule,
    UserUseCasesModule,
    TodoUseCasesModule,
  ],
  controllers: [
    TodoController,
    UserController,
  ],
  providers: [],
})
export class AppModule {}
