import { PrismaModule } from "../../../libs/common/src/prisma/prisma.module";
import { PinoModule } from "../../../libs/common/src/pino/pino.module";
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import appConfig from "./configs/todo-service.config";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../../auth/src/auth.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PinoModule
  ],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
