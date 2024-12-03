import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTodo, ListTodos, UpdateTodos } from '../../types/todo.types';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(private prismaService: PrismaService) {}

  async createTodo(data: CreateTodo, userId: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ConflictException('User not found');
      }

      const newTodo = await this.prismaService.todo.create({
        data: {
          userId,
          title: data.title,
        },
      });

      return {
        message: 'Todo created successfully',
        todo: newTodo,
      };
    } catch (error) {
      this.logger.error('Error during Todo creation', error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Todo creation failed');
    }
  }

  async listTodos(data: ListTodos) {
    try {
      const { userId } = data;
      const todos = await this.prismaService.todo.findMany({
        where: { userId },
      });

      return {
        message: 'Todos fetched successfully',
        data: {
          todos,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching Todos', error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Todo failed');
    }
  }

  async updateTodo(data: UpdateTodos, todoId: number) {
    try {
      const todo = await this.prismaService.todo.findUnique({
        where: { id: todoId },
      });

      if (!todo) {
        throw new ConflictException('Not found');
      }

      const update = await this.prismaService.todo.update({
        where: { id: todoId },
        data: {
          title: data.title,
          completed: data.completed,
        },
      });

      return {
        message: 'Updated Successfully',
        update,
      };
    } catch (error) {
      this.logger.error('Error updating Todos', error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Todo update failed');
    }
  }

  async deleteTodo(todoId: number) {
    const todo = await this.prismaService.todo.findUnique({
      where: { id: todoId },
    });

    if (!todo) {
      throw new ConflictException('Not found');
    }

    const data = await this.prismaService.todo.delete({
      where: { id: todoId },
    });

    return {
      message: 'Deleted Successfully',
      data,
    };
  }
}
