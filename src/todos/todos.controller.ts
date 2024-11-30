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
import { User } from '@prisma/client';

@ApiTags('Todos')
@ApiBearerAuth('Access-Token')
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new task to your todo list' })
  @ApiResponse({
    status: 201,
    description: 'A new task was successfully created.',
    schema: {
      example: {
        id: 1,
        title: 'Prepare Presentation',
        description: 'Complete slides for team meeting',
        completed: false,
        dueDate: '2024-12-05T00:00:00.000Z',
        createdAt: '2024-11-30T00:00:00.000Z',
        updatedAt: '2024-11-30T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input provided' })
  create(@GetUser() user: User, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user.id, createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve your list of todos' })
  @ApiQuery({
    name: 'completed',
    required: false,
    type: Boolean,
    description: 'Filter by completion status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by title or description',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    default: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'dueDate', 'title'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order of sorting (asc or desc)',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of todos matching your filters.',
    schema: {
      example: [
        {
          id: 1,
          title: 'Prepare Presentation',
          description: 'Complete slides for team meeting',
          completed: false,
          dueDate: '2024-12-05T00:00:00.000Z',
          createdAt: '2024-11-30T00:00:00.000Z',
          updatedAt: '2024-11-30T00:00:00.000Z',
        },
      ],
    },
  })
  findAll(
    @GetUser() user: User,
    @Query('completed') completed?: boolean,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'createdAt' | 'dueDate' | 'title',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.todosService.findAll(user.id, {
      completed,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch details of a specific task by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo item',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the requested todo item.',
    schema: {
      example: {
        id: 1,
        title: 'Prepare Presentation',
        description: 'Complete slides for team meeting',
        completed: false,
        dueDate: '2024-12-05T00:00:00.000Z',
        createdAt: '2024-11-30T00:00:00.000Z',
        updatedAt: '2024-11-30T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify an existing task' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo item',
  })
  @ApiResponse({
    status: 200,
    description: 'Todo successfully updated.',
    schema: {
      example: {
        id: 1,
        title: 'Prepare Presentation (Updated)',
        description: 'Finalize and review slides for the meeting',
        completed: true,
        dueDate: '2024-12-05T00:00:00.000Z',
        createdAt: '2024-11-30T00:00:00.000Z',
        updatedAt: '2024-11-30T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(user.id, id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a task from your todo list' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo item',
  })
  @ApiResponse({ status: 200, description: 'Todo successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(user.id, id);
  }

  @Patch(':id/completed')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the todo item',
  })
  @ApiResponse({
    status: 200,
    description: 'Todo successfully marked as completed.',
    schema: {
      example: {
        id: 1,
        title: 'Prepare Presentation',
        description: 'Complete slides for team meeting',
        completed: true,
        dueDate: '2024-12-05T00:00:00.000Z',
        createdAt: '2024-11-30T00:00:00.000Z',
        updatedAt: '2024-11-30T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  markAsCompleted(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.todosService.markAsCompleted(user.id, id);
  }
}
