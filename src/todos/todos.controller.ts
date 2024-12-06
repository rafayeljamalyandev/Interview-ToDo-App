import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoDto } from './todos.dto';
import { TODO_CREATE_ERROR } from './todos.constants';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  async create(@Body() todoDto: TodoDto, @Req() req) {
    try {
      return this.todosService.createTodo(req.user.id, todoDto);
    } catch (error) {
      throw new HttpException(TODO_CREATE_ERROR, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async list(@Req() req) {
    return this.todosService.listTodos(req.user.id);
  }
}
