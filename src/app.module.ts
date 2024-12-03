import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [],
})
export class AppModule {}
