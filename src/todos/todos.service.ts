import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TodoDto } from './todos.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TODO_CREATE_ERROR, TODOS_FETCH_ERROR } from './todos.constants';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: number, todoDto: TodoDto) {
    try {
      return await this.prisma.todo.create({
        data: {
          title: todoDto.title,
          userId,
          completed: todoDto.completed ?? false,
        },
      });
    } catch (error) {
      throw new HttpException(TODO_CREATE_ERROR, HttpStatus.FORBIDDEN);
    }
  }

  async listTodos(userId: number) {
    try {
      return await this.prisma.todo.findMany({
        where: { userId },
      });
    } catch (error) {
      throw new HttpException(TODOS_FETCH_ERROR, HttpStatus.FORBIDDEN);
    }
  }
}
