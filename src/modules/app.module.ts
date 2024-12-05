import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos.module';

@Module({
  imports: [
    AuthModule,
    TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [],
})
export class AppModule {}
