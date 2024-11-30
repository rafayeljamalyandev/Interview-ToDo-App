import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Todos')
@ApiBearerAuth('JWT-auth') // Añade esto
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'Todo successfully created',
    schema: {
      example: {
        id: 1,
        title: 'Complete Project',
        description: 'Finish the documentation',
        completed: false,
        dueDate: '2024-03-20T00:00:00.000Z',
        createdAt: '2024-03-15T00:00:00.000Z',
        updatedAt: '2024-03-15T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@GetUser() user: any, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user.id, createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiQuery({ name: 'completed', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns all todos',
    schema: {
      example: [
        {
          id: 1,
          title: 'Complete Project',
          description: 'Finish the documentation',
          completed: false,
          dueDate: '2024-03-20T00:00:00.000Z',
          createdAt: '2024-03-15T00:00:00.000Z',
          updatedAt: '2024-03-15T00:00:00.000Z',
        },
      ],
    },
  })
  findAll(
    @GetUser() user: any,
    @Query('completed') completed?: boolean,
    @Query('search') search?: string,
  ) {
    return this.todosService.findAll(user.id, { completed, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a todo',
    schema: {
      example: {
        id: 1,
        title: 'Complete Project',
        description: 'Finish the documentation',
        completed: false,
        dueDate: '2024-03-20T00:00:00.000Z',
        createdAt: '2024-03-15T00:00:00.000Z',
        updatedAt: '2024-03-15T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'Todo successfully updated',
    schema: {
      example: {
        id: 1,
        title: 'Updated Project',
        description: 'Updated description',
        completed: true,
        dueDate: '2024-03-20T00:00:00.000Z',
        createdAt: '2024-03-15T00:00:00.000Z',
        updatedAt: '2024-03-15T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(user.id, id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo successfully deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(user.id, id);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Get todo statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns todo statistics',
    schema: {
      example: {
        total: 10,
        completed: 5,
        pending: 5,
        completionRate: 50,
      },
    },
  })
  getStats(@GetUser() user: any) {
    return this.todosService.getStats(user.id);
  }
}
