import { Controller, Get, Post, Body, Req, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { TodosService } from 'src/services/todos.service';
import { CreateTodoDto } from 'src/dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() body: CreateTodoDto, @Req() req) {
    try {
      const todo = await this.todosService.createTodo(req.user.id, body.title);
      return { status: 'success', data: todo };
    } catch (error) {
      throw new HttpException('Error creating todo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async list(@Req() req) {
    try {
      const todos = await this.todosService.listTodos(req.user.id);
      return { status: 'success', data: todos };
    } catch (error) {
      throw new HttpException('Error fetching todos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
