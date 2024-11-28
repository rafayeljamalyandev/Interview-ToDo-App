import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { TodosServiceV1 } from './todos.service-v1';

@Controller({ path: 'todos', version: '1' })
export class TodosControllerV1 {
  constructor(private todosService: TodosServiceV1) {}

  @Post()
  async create(@Body() body: { title: string }, @Req() req) {
    return this.todosService.createTodo(req.user.id, body.title);
  }

  @Get()
  async list(@Req() req) {
    return this.todosService.listTodos(req.user.id);
  }
}
