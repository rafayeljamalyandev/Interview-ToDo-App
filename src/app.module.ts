import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataServicesModule } from './services/data-services/data-services.module';
import { UserUseCasesModule } from './use-cases/user/user-use-cases.module';
import { TodoUseCasesModule } from './use-cases/todo/todo-use-cases.module';
import { AppController, TodoController, UserController } from './controllers';

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
    AppController,
    TodoController,
    UserController,
  ],
  providers: [],
})
export class AppModule {}
