import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dtos/todo.dto';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(
    userId: number,
    TodoInfo: CreateTodoDto,
  ): Promise<ServiceResponse> {
    try {
      const todo = await this.prisma.todo.create({
        data: { userId, title: TodoInfo.title },
      });

      return successResponse(todo);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async listTodos(userId: number) {
    try {
      const todoList = await this.prisma.todo.findMany({ where: { userId } });

      return successResponse(todoList);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }
}
