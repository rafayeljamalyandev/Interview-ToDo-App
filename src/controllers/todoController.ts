import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { TodoUseCases } from '../use-cases/todo/todo.use-case';

@Controller('api/todo')
export class TodoController {
  constructor(private todoUseCases: TodoUseCases) {}

  @Get()
  async getAllTodos() {
    return this.todoUseCases.getAllTodos();
  }

  @Get(':id')
  async getTodoById(@Param('id') id: any) {
    return this.todoUseCases.getTodoById(id);
  }

}
