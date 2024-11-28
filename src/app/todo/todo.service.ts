import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Todo } from '@prisma/client';
import { Request } from 'express';

import { TodosService } from '../../services/todos/todos.service';
import { CreateDto } from './dto/create.dto';
import { TokenService } from '../../common/token/token.service';

@Injectable()
export class TodoService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly tokenService: TokenService,
    private readonly todosService: TodosService,
  ) {}

  async create(dto: CreateDto): Promise<Todo> {
    try {
      const token = this.tokenService.extractToken(this.request);
      const { sub } = this.tokenService.decode(token);
      const payload = {
        userId: sub,
        title: dto.title,
      };

      const todo = await this.todosService.createTodo(payload);
      return todo;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async getList(): Promise<Todo[]> {
    try {
      const token = this.tokenService.extractToken(this.request);
      const { sub } = this.tokenService.decode(token);

      const todoList = await this.todosService.listTodos(sub);
      return todoList;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
