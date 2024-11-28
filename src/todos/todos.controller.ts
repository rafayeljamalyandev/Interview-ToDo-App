import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// Added JWT authentication guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TodosService } from './todos.service';
// Added custom decorator for user extraction
import { currentUser } from 'src/auth/current-user.decorator';
// Added type safety for JWT payload
import { TokenPayload } from 'src/auth/token-payload.interface';
// Added DTO for request validation
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  // Added JWT authentication protection
  @UseGuards(JwtAuthGuard)
  async createTodo(
    // Added DTO validation instead of raw body
    @Body() createTodoDto: CreateTodoDto,
    // Added type-safe user extraction instead of req.user
    @currentUser() user: TokenPayload,
  ) {
    return this.todosService.createTodo(createTodoDto, user.userId);
  }

  @Get()
  // Added JWT authentication protection
  @UseGuards(JwtAuthGuard)
  async getTodos(
    // Added type-safe user extraction instead of req.user
    @currentUser() user: TokenPayload,
  ) {
    return this.todosService.listTodos(user.userId);
  }
}

// import { Controller, Get, Post, Body, Req } from '@nestjs/common';
// import { TodosService } from './todos.service';

// @Controller('todos')
// export class TodosController {
//   constructor(private todosService: TodosService) {}

//   @Post()
//   async create(@Body() body: { title: string }, @Req() req) {
//     return this.todosService.createTodo(req.user.id, body.title);
//   }

//   @Get()
//   async list(@Req() req) {
//     return this.todosService.listTodos(req.user.id);
//   }
// }
