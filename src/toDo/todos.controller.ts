import { Controller, Get, Post, Patch, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.decorator';
import { T_UserWithoutPassword } from '../types/user';
import { CreateTodoDto, UpdateTodoDto } from './dto/toDo.dto';

@ApiBearerAuth()
@ApiTags('TO DO')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @ApiOperation({ summary: 'Create a new todo' })
  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @User() user: T_UserWithoutPassword,
  ) {
    return this.todosService.createTodo(createTodoDto, user.id);
  }

  @ApiOperation({ summary: 'get todos for the current user' })
  @Get()
  async list(@User() user: T_UserWithoutPassword) {
    return this.todosService.listTodos(user.id);
  }

  @ApiOperation({ summary: 'Update todo by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the todo to update', example: 1 })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: T_UserWithoutPassword,
  ) {
    return this.todosService.updateTodo(id, updateTodoDto, user.id);
  }
}
