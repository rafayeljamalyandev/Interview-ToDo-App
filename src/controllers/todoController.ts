import { Controller, Get, Param, Post, Body, Put, Req } from '@nestjs/common';
import { TodoUseCases } from '../use-cases/todo/todo.use-case';
import { CreateTodoDto } from '../core/dtos';

@Controller('api/todo')
export class TodoController {
  constructor(private todoUseCases: TodoUseCases) {}

  @Post()
  async create(@Body() body: CreateTodoDto, @Req() req) {
    return this.todoUseCases.createTodo(  body);
  }

  @Get()
  async list(@Req() req) {
    return this.todoUseCases.listTodos(req.user.id);
  }

  @Get()
  async getAllTodos() {
    // return this.todoUseCases.getAllTodos();
  }

  @Get(':id')
  async getTodoById(@Param('id') id: any) {
    // return this.todoUseCases.getTodoById(id);
  }


}
