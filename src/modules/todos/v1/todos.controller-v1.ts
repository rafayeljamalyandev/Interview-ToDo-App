import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TodosServiceV1 } from './todos.service-v1';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { ReqCreateTodoDTO } from './dto/request.dto';

@Controller({ path: 'todos', version: '1' })
export class TodosControllerV1 {
  constructor(private todosService: TodosServiceV1) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: ReqCreateTodoDTO) {
    return await this.todosService.createTodo(body);
  }

  // @Get()
  // async list(@Req() req) {
  //   return this.todosService.listTodos(req.user.id);
  // }
}
