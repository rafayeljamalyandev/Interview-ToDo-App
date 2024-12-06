import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todos.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserPayload } from 'src/common/types';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(AuthGuard)
  @Get()
  async list(@GetUser() user: UserPayload) {
    const todos = await this.todosService.listTodos(user.userId);
    return {
      message: 'success',
      data: {
        todos,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateTodoDto, @GetUser() user: UserPayload) {
    return this.todosService.createTodo(body, user.userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param() params: { id: string },
    @Body() body: UpdateTodoDto,
    @GetUser() user: UserPayload,
  ) {
    return this.todosService.updateTodo(+params.id, body, user.userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param() params: { id: string }, @GetUser() user: UserPayload) {
    await this.todosService.deleteTodo(+params.id, user.userId);
    return { message: 'Todo deleted' };
  }
}
