import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  Patch,
} from '@nestjs/common';

import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Todo } from '@prisma/client';
import { BaseResponseDto } from '../libs/dto/reponse.dto';
import { CreateTodoDto, UpdateTodoDto } from '../libs/dto/todo.dto';
import { JwtAuthGuard } from '../libs/jwt/jwt.guard';
import { TodoService } from '../modules/todo/todos.service';

@ApiTags('Todos')
@ApiBearerAuth('Bearer')
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodoService) {}

  /**
   * Create a TODO
   */
  @ApiOperation({ summary: 'Create a new Todo' })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'TODO created successfully.',
    type: BaseResponseDto<number, string, Todo>,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or missing fields.' })
  async create(@Body(ValidationPipe) data: CreateTodoDto, @Request() req: any) {
    const { sub: userId } = req.user;
    return this.todosService.createTodo(data, userId);
  }

  /**
   * List all TODOs for the authenticated user
   */
  @ApiOperation({ summary: 'Return a list of all Todos' })
  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of TODOs retrieved successfully.',
    type: BaseResponseDto<number, string, Todo[]>,
  })
  @ApiResponse({ status: 404, description: 'No TODOs found for the user.' })
  async list(@Request() req: any) {
    const { sub: userId } = req.user;
    return this.todosService.listTodos(userId);
  }

  /**
   * Retrieve a specific TODO by ID
   */
  @ApiOperation({ summary: 'Retrieve Todo based on ID' })
  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'TODO retrieved successfully.',
    type: BaseResponseDto<number, string, Todo>,
  })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  async getTodo(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const { sub: userId } = req.user;
    return this.todosService.getTodoById(id, userId);
  }

  /**
   * Update a TODO by ID
   */
  @ApiOperation({ summary: 'Update Todo' })
  @Patch(':id/update')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'TODO updated successfully.',
    type: BaseResponseDto<number, string, Todo>,
  })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input or update failed.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateTodoDto,
    @Request() req: any,
  ) {
    const { sub: userId } = req.user;
    return this.todosService.updateTodo(id, userId, data);
  }

  /**
   * Delete a TODO by ID
   */
  @ApiOperation({ summary: 'Delete Todo' })
  @Delete(':id/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'TODO deleted successfully.',
    type: BaseResponseDto<number, string, null>,
  })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const { sub: userId } = req.user;
    return this.todosService.deleteTodo(id, userId);
  }
}
