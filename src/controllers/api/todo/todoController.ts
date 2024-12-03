import {Controller, Get, Param, Post, Body, Put, Req, Query} from '@nestjs/common';
import { TodoUseCases } from '../../../use-cases/todo/todo.use-case';
import {CreateTodoDto, ListTodosDto} from '../../../core/dtos';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('api/todo')
export class TodoController {
  constructor(private todoUseCases: TodoUseCases) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'todo created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createTodo(@Body() body: CreateTodoDto, @Req() req) {
    try {
      let result =await this.todoUseCases.createTodo(body);
      return {
        status: 200,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('listTodos')
  @ApiResponse({ status: 200, description: 'here are a list of todos' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async listTodos(
      @Req() req: Request,
      @Query() query: ListTodosDto
  ) {
    try {
      const userId = (req?.body as any).jwt?.data?.userId;
      let result = await this.todoUseCases.listTodos(userId,query.skip,query.take);
      return {
        status: 200,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  //------------------------------ Not Implement -------------------------------------------------------------

  // @Get()
  // async getAllTodos() {
  //   return this.todoUseCases.getAllTodos();
  // }


  // @Get(':id')
  // async getTodoById(@Param('id') id: any) {
  //   return this.todoUseCases.getTodoById(id);
  // }
}
