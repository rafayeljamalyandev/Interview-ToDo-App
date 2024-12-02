import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../api/user/user.controller';
import { ApiMiddleware } from '../middleware/api.middleware';
import { TodoController } from '../api/todo/todoController';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController, TodoController],
  providers: [ApiMiddleware],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiMiddleware)
      .exclude({ path: 'api/user', method: RequestMethod.POST })
      .forRoutes(
          { path: 'api/user', method: RequestMethod.GET },
          { path: 'api/todo', method: RequestMethod.POST },
          { path: 'api/todo', method: RequestMethod.GET },
      );
  }
}
