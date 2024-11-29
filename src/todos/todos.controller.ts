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
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@GetUser() user: any, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user.id, createTodoDto);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.todosService.findAll(user.id);
  }

  @Get(':id')
  findOne(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(user.id, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(user.id, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(user.id, id);
  }
}
