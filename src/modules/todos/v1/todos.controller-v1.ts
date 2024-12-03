import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TodosServiceV1 } from './todos.service-v1';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { ReqCreateTodoDTO, ReqGetListTodoDTO } from './dto/request.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserEnum } from 'src/common/enums';

@Controller({ path: 'todos', version: '1' })
export class TodosControllerV1 {
  constructor(private todosService: TodosServiceV1) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() body: ReqCreateTodoDTO,
    @CurrentUser(CurrentUserEnum.userId) userId: number,
  ) {
    body.userId = userId;
    return await this.todosService.createTodo(body);
  }

  @UseGuards(AuthGuard)
  @Get()
  async list(
    @Query() query: ReqGetListTodoDTO,
    @CurrentUser(CurrentUserEnum.userId) userId: number,
  ) {
    query.userId = userId;
    return await this.todosService.listTodos(query);
  }
}
