import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Todo } from '@prisma/client';

import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TodoService } from './todo.service';
import { CreateDto } from './dto/create.dto';

@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() dto: CreateDto): Promise<Todo> {
    return this.todoService.create(dto);
  }

  @Get()
  list(): Promise<Todo[]> {
    return this.todoService.getList();
  }
}
