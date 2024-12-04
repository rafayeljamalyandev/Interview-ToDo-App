import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todo/todos.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : 'soome_secreeet_valuuuue',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  providers: [],
})
export class AppModule {}
