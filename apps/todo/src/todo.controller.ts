import { JwtGuard } from '../../../libs/common/src/common/guards/jwt.guard';
import { AuthorizedRequest } from '../../../libs/common/src/common/types/authorized-request.type';
import { PaginationQueryDto } from '../../../libs/common/src/common/dto/pagination.dto';
import { TodoService } from './todo.service';
import { CreateTodoDTO } from './dto/create-todo.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Req() req: AuthorizedRequest, @Body() dto: CreateTodoDTO) {
    return this.todoService.createTodo(req, dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  async list(
    @Req() req: AuthorizedRequest,
    @Query() query: PaginationQueryDto,
  ) {
    return this.todoService.listTodos(req, query);
  }
}
