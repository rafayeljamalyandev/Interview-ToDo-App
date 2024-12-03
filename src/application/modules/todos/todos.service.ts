import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTodoDto } from './dto/create.todo.dto';
import { UpdateTodoDto } from './dto/update.todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(createTodoDto: CreateTodoDto, userId: number) {
    try {
      return await this.prisma.todo.create({
        data: {
          title: createTodoDto.title,
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create TODO');
    }
  }

  async listAllTodos() {
    return this.prisma.todo.findMany();
  }

  async listTodosByUserId(userId: number) {
    try {
      const todos = await this.prisma.todo.findMany({ where: { userId } });
      if (todos.length === 0) {
        throw new NotFoundException('No TODOs found for this user');
      }
      return todos;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch TODOs');
    }
  }

  async updateTodoById(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ) {
    try {
      const existingTodo = await this.prisma.todo.findUnique({ where: { id } });

      if (!existingTodo) {
        throw new NotFoundException('TODO not found');
      }

      if (existingTodo.userId !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this TODO',
        );
      }

      return await this.prisma.todo.update({
        where: { id },
        data: {
          title: updateTodoDto.title,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update TODO');
    }
  }
}
