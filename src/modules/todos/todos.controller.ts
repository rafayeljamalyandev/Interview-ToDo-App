import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  HttpCode,
  UnauthorizedException,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodo, UpdateTodos } from '../../types/todo.types';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: CreateTodo, @Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.todosService.createTodo(body, req.user.id);
  }

  @Get()
  @HttpCode(200)
  async list(@Req() req: any) {
    return this.todosService.listTodos(req.user.id);
  }

  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTodos,
  ) {
    return this.todosService.updateTodo(body, id);
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.deleteTodo(id);
  }
}
