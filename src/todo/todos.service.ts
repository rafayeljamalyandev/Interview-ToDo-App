import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from 'src/todo/todos.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(dto: CreateTodoDto, userId: number) {
    return this.prisma.todo.create({
      data: { title: dto.title, userId },
    });
  }

  async listTodos(userId: number) {
    return this.prisma.todo.findMany({ where: { userId } });
  }

  async updateTodo(id: number, dto: UpdateTodoDto, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id, userId },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.prisma.todo.update({
      where: { id, userId },
      data: { title: dto.title, completed: dto.completed },
    });
  }

  async deleteTodo(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id, userId },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.prisma.todo.delete({ where: { id, userId } });
  }
}
