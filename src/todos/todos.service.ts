import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: number, title: string) {
    return this.prisma.todo.create({
      data: { title, userId },
    });
  }

  async listTodos(userId: number) {
    return this.prisma.todo.findMany({ where: { userId } });
  }

  // Generalized method to validate and update todos
  private async validateAndUpdate(
    userId: number,
    todoId: number,
    updateData: Partial<{ title: string; completed: boolean }>,
  ) {
    const validTodoId = Number(todoId);
    if (isNaN(validTodoId) || validTodoId <= 0) {
      throw new BadRequestException('Invalid Todo ID');
    }

    const validUserId = Number(userId);
    if (isNaN(validUserId) || validUserId <= 0) {
      throw new BadRequestException('Invalid User ID');
    }

    const todo = await this.prisma.todo.findFirst({
      where: { id: validTodoId, userId: validUserId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${validTodoId} not found`);
    }

    return this.prisma.todo.update({
      where: { id: validTodoId },
      data: updateData,
    });
  }

  async completeTodo(todoId: number, userId: number) {
    return this.validateAndUpdate(userId, todoId, { completed: true });
  }

  async editTodo(todoId: number, newTitle: string, userId: number) {
    return this.validateAndUpdate(userId, todoId, { title: newTitle });
  }
}
