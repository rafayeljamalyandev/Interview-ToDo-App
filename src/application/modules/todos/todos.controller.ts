import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create.todo.dto';
import { GetCurrentUserId, Public } from '../../../common/decorators';
import { UpdateTodoDto } from './dto/update.todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @GetCurrentUserId() userId: number,
  ) {
    const todo = await this.todosService.createTodo(createTodoDto, userId);
    return { data: todo };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listAll() {
    const todos = await this.todosService.listAllTodos();
    return { data: todos };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async listById(@Param('id', ParseIntPipe) id: number) {
    const todos = await this.todosService.listTodosByUserId(id);
    return { data: todos };
  }

  @Put(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @GetCurrentUserId() userId: number,
  ) {
    const updatedTodo = await this.todosService.updateTodoById(
      id,
      updateTodoDto,
      userId,
    );
    return { data: updatedTodo };
  }
}
