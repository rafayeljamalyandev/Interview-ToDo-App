import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from '../api/user/user.controller';
import { TodoController } from '../api/todo/todoController';
import { ApiMiddleware } from '../middleware/api.middleware';
import {UserFactoryService} from "../../use-cases/user/user-factory.service";
import {UserUseCases} from "../../use-cases/user/user.use-case";
import {TodoUseCases} from "../../use-cases/todo/todo.use-case";
import {IDataServices} from "../../core";
import {PrismaDataServices} from "../../frameworks/data-services/mysql/prisma-data-services";
import {PrismaService} from "../../frameworks/data-services/mysql/prisma.service";
import {TodoFactoryService} from "../../use-cases/todo/todo-factory.service";

@Module({
  imports: [],
  controllers: [UserController, TodoController],
  providers: [
      UserUseCases,TodoUseCases,PrismaService,UserFactoryService,TodoFactoryService,
    {
      provide: IDataServices,
      useClass: PrismaDataServices,
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
    .exclude(
      { path: 'api/user/register', method: RequestMethod.POST },
      { path: 'api/user/login', method: RequestMethod.POST }
    )
    .forRoutes(
      { path: 'api/todo/create', method: RequestMethod.POST },
      { path: 'api/todo/listTodos', method: RequestMethod.GET }
    );
  }


}
