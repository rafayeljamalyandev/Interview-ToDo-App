import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { JwtAuthGuard } from '../common/guards/jwtAuthGuard';
import { ITodo } from '../common/interfaces/todo.interface';
import { UpdateTodoDto } from './dtos/updateTodo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req,
  ): Promise<ITodo> {
    const userId = Number(req.user.id);
    return this.todosService.createTodo(createTodoDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req): Promise<ITodo[]> {
    const userId = Number(req.user.id);
    return this.todosService.listUserTodos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
    @Param('id') id: number,
  ): Promise<ITodo> {
    const userId: number = Number(req.user.id);
    return this.todosService.updateTodo(id, userId, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number): Promise<string> {
    const userId: number = Number(req.user.id);
    return this.todosService.deleteTodo(id, userId);
  }
}
