import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from 'src/common/decorators/user.decorator';

@Controller({ path: 'todos', version: '1' })
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async create(@Body() body: CreateTodoDto, @User() req: { userId: number }) {
    return this.todosService.createTodo(req.userId, body.title);
  }

  @Get()
  async list(@User() req: { userId: number }) {
    return this.todosService.listTodos(req.userId);
  }
}
