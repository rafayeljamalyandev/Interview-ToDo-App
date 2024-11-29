import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todos')
@Controller({ path: 'todos', version: '1' })
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all todos' })
  @ApiResponse({ status: 200, description: 'Todos retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Token is missing.' })
  async list(@User() req: { userId: number }) {
    return this.todosService.listTodos(req.userId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors occurred.' })
  async create(@Body() body: CreateTodoDto, @User() req: { userId: number }) {
    return this.todosService.createTodo(req.userId, body.title);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation errors occurred.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async editTodo(
    @Param('id') todoId: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() req: { userId: number },
  ) {
    const { title } = updateTodoDto;
    if (!title || title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }
    return this.todosService.editTodo(todoId, title, req.userId);
  }

  @Patch(':id/complete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a todo as completed' })
  @ApiResponse({ status: 200, description: 'Todo marked as completed.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async completeTodo(
    @Param('id') todoId: number,
    @User() req: { userId: number },
  ) {
    return this.todosService.completeTodo(todoId, req.userId);
  }
}
