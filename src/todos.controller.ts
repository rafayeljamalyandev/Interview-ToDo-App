import { Controller, Post, Body, Get, Query, UseGuards, UsePipes, ValidationPipe, Req, HttpException, HttpStatus} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosDto } from './dto/list-todos.dto';
import { Request } from 'express'; // Import Request to access user data

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Automatically validates and trasnforms the body based on DTO
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {

    console.log('Request User:', req.user);
    // Access userId from req.user, as it was attached in the JwtMiddleware
    const { userId } = req.user;

    if (!userId) {
      throw new HttpException('User ID not found in token', HttpStatus.UNAUTHORIZED);
    }

    // Pass the userId in the DTO
    createTodoDto.userId = userId;

    // Pass the userId to the service
    return this.todosService.createTodo(createTodoDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // Automatically validates and transforms the query params
  async listTodos(@Query() listTodosDto: ListTodosDto, @Req() req: Request) {
    console.log('Request User:', req.user);
    
    // Access userId from req.user, as it was attached in the JwtMiddleware
    const { userId } = req.user;

    if (!userId) {
      throw new HttpException('User ID not found in token', HttpStatus.UNAUTHORIZED);
    }

    // Pass the userId in the DTO
    listTodosDto.userId = userId;

    // Pass the userId to the service to filter todos by user
    return this.todosService.listTodos(listTodosDto);
  }
}
