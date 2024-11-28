import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { JwtMiddleware } from './auth/jwt/jwt.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/');
  }
}
