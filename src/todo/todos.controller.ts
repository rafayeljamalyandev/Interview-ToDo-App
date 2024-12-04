import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { TodoService } from './todos.service';
import { JwtGuard } from 'src/shared/middlewares/auth.guard';
import { CreateTodoDto } from './dtos/todo.dto';
import { Response } from 'express';

/* I'm using @Res() decorator to have customized consistence response for all requests
   for big projects we can use Interceptors to make it more Nest.JS friendly */
@Controller('todos')
@UseGuards(JwtGuard)
export class TodosController {
  constructor(private todosService: TodoService) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() body: CreateTodoDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.todosService.createTodo(req.user.userId, body);
    response.status(result.code).json(result);
  }

  @Get()
  async list(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    const result = await this.todosService.getUserTodoList(req.user.userId);
    response.status(result.code).json(result);
  }
}
