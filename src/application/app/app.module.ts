import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { TodosModule } from '../modules/todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from '../../common/guards';
import { PrismaModule } from '../../infrastructure/database/prisma.module';

@Module({
  imports: [
    AuthModule,
    TodosModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    AtGuard,
    {
      provide: APP_GUARD,
      useExisting: AtGuard,
    },
  ],
})
export class AppModule {}
