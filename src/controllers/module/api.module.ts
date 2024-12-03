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
      .forRoutes('*');
      // .forRoutes({ path: 'api/todo/*', method: RequestMethod.ALL });

    // .exclude(
      //   { path: 'api/user/register', method: RequestMethod.POST }, // Exclude specific routes
      //   { path: 'api/user/login', method: RequestMethod.POST }
      // )
      // .forRoutes(
      //   { path: 'api/todo/create', method: RequestMethod.POST }, // Attach middleware to these routes
      //   { path: 'api/todo/listTodos', method: RequestMethod.GET }
      // );
  }
}