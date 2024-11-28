import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './app/auth/auth.module';
import { TodosModule } from './services/todos/todos.module';
import { TokenModule } from './common/token/token.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TodoModule } from './app/todo/todo.module';
import { UsersModule } from './services/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    TodosModule,
    PrismaModule,
    TokenModule,
    TodoModule,
    UsersModule,
  ],
})
export class AppModule {}
