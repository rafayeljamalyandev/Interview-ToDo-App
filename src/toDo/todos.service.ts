import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { T_ToDoResponse } from '../types/todo';
import { CreateTodoDto, UpdateTodoDto } from './dto/toDo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(dto: CreateTodoDto, userId: number): Promise<T_ToDoResponse> {
    try {
      return await this.prisma.todo.create({
        data: { title: dto.title, userId },
      });
    } catch (error) {
      if (error instanceof Error){
        throw error
      }
      throw new Error(`Failed to create to-do item: ${error.message}`);
    }
  }

  async listTodos(userId: number): Promise<T_ToDoResponse[]> {
    try {
      return await this.prisma.todo.findMany({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof Error){
        throw error
      }
      throw new Error(`Failed to fetch to-do items: ${error.message}`);
    }
  }

  async updateTodo(
    id: number,
    body: UpdateTodoDto,
    userId: number
  ): Promise<T_ToDoResponse> {
    try {
      const existingTodo = await this.prisma.todo.findUnique({ where: { id } });

      if (!existingTodo) {
        throw new NotFoundException('Not found');
      }

      if (existingTodo.userId !== userId) {
        throw new ForbiddenException('You are not authorized to update this to-do');
      }

      return await this.prisma.todo.update({
        where: { id },
        data: body,
      });
    } catch (error) {
      if (error instanceof Error){
        throw error
      }
      throw new Error(`Failed to update to-do item: ${error.message}`);
    }
  }
}
