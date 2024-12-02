import { Controller, Get, Post, Put, Delete, Param,Query, Body, Req, HttpException, UseGuards } from '@nestjs/common';
import { TodoService } from './todos.service';
import { UpdateTodoDto } from './dto/update-todo-dto';
import { CreateTodoDto } from './dto/create-todo-dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard'


@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create')
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    try {
      const newTodo = await this.todoService.create(createTodoDto, req.user.id);
      return { message: 'Todo created successfully', data: newTodo };
    } catch (error) {
      console.log(error)
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('list')
  async getTodosByUser(@Req() req) {
    try {
      const todos = await this.todoService.getTodosByUser(req.user.id);
      return { message: 'Todos fetched successfully', data: todos };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('find/:id')
  async getTodoById(@Param('id') id: number, @Req() req) {
    try {
      const todo = await this.todoService.getTodoById(id, req.user.id);
      return { message: 'Todo fetched successfully', data: todo };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('update/:id')
  async updateTodo(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto, @Req() req) {
    try {
      const updatedTodo = await this.todoService.updateTodo(id, updateTodoDto, req.user.id);
      return { message: 'Todo updated successfully', data: updatedTodo };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('delete/:id')
  async deleteTodo(@Param('id') id: number, @Req() req) {
    try {
      await this.todoService.deleteTodo(id, req.user.id);
      return { message: 'Todo deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('search')
async searchTodos(@Req() req, @Query('query') query: string) {
  try {

    const todos = await this.todoService.searchTodos(req.user.id, query);

    if (!query) {
      throw new HttpException('Search query is required', 400);
    }
    
    if (todos.length === 0) {
      return {
        message: 'No todos found matching your query.',
        data: [],
      };
    }
    return {
      message: 'Todos retrieved successfully',
      data: todos, 
    };
  } catch (error) {
    throw new HttpException(error.message, error.status || 500);
  }
}

}
