import { Controller, Get, Param, Post, Body, Put, Req } from '@nestjs/common';
import { TodoUseCases } from '../../../use-cases/todo/todo.use-case';
import { CreateTodoDto } from '../../../core/dtos';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('api/todo')
export class TodoController {
  constructor(private todoUseCases: TodoUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createTodo(@Body() body: CreateTodoDto, @Req() req) {
    try {
      let result = this.todoUseCases.createTodo(body);
      return {
        status: 200,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async listTodos(@Req() req) {
    try {
      let result = this.todoUseCases.listTodos(req.user.id);
      return {
        status: 200,
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  //---------------------------------------------------------------------------------------------

  // @Get()
  // async getAllTodos() {
  //   return this.todoUseCases.getAllTodos();
  // }


  // @Get(':id')
  // async getTodoById(@Param('id') id: any) {
  //   return this.todoUseCases.getTodoById(id);
  // }
}
