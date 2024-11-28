import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
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

  @Patch(':id')
  async editTodo(
    @Param('id') todoId: number,
    @Body('title') title: string,
    @User() req: { userId: number },
  ) {
    if (!title || title.trim().length === 0)
      throw new NotFoundException('Title is required');
    return this.todosService.editTodo(todoId, title, req.userId);
  }

  @Patch(':id/complete')
  async completeTodo(
    @Param('id') todoId: number,
    @User() req: { userId: number },
  ) {
    return this.todosService.completeTodo(todoId, req.userId);
  }
}
