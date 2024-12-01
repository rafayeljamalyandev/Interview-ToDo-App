import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { buildPaginatedResponse } from '../utils/build-pagination-response';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto) {
    const { title, dueDate } = createTodoDto;

    await this.ensureNoDuplicateTitle(userId, title);

    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    try {
      const newTodo = await this.prisma.todo.create({
        data: { ...createTodoDto, userId },
        include: { user: { select: { id: true, name: true } } },
      });
      return newTodo;
    } catch (error) {
      this.logError('create', userId, error);
      throw error;
    }
  }

  async findAll(
    userId: number,
    params: {
      completed?: boolean;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: 'createdAt' | 'dueDate' | 'title';
      sortOrder?: 'asc' | 'desc';
    } = {},
  ) {
    const {
      completed,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(completed !== undefined && {
        completedAt: completed ? { not: null } : null,
      }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    try {
      const [todos, total] = await Promise.all([
        this.prisma.todo.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        this.prisma.todo.count({ where }),
      ]);

      return buildPaginatedResponse(todos, total, page, limit);
    } catch (error) {
      this.logError('findAll', userId, error);
      throw error;
    }
  }

  async findOne(userId: number, id: number) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id, userId },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      if (!todo) {
        throw new NotFoundException(
          `Todo with ID ${id} not found or you don't have access to it`,
        );
      }

      return todo;
    } catch (error) {
      this.logError(`findOne(${id})`, userId, error);
      throw error;
    }
  }

  async update(userId: number, id: number, updateTodoDto: UpdateTodoDto) {
    const { title, dueDate } = updateTodoDto;

    const todo = await this.findOne(userId, id);

    if (dueDate && new Date(dueDate) < new Date()) {
      throw new BadRequestException('Due date cannot be in the past');
    }

    if (title && title !== todo.title) {
      await this.ensureNoDuplicateTitle(userId, title, id);
    }

    try {
      return await this.prisma.todo.update({
        where: { id },
        data: updateTodoDto,
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (error) {
      this.logError(`update(${id})`, userId, error);
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    try {
      return await this.prisma.todo.delete({ where: { id } });
    } catch (error) {
      this.logError(`remove(${id})`, userId, error);
      throw error;
    }
  }

  async markAsCompleted(userId: number, id: number) {
    await this.findOne(userId, id);

    try {
      return await this.prisma.todo.update({
        where: { id },
        data: { completedAt: new Date() },
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (error) {
      this.logError(`markAsCompleted(${id})`, userId, error);
      throw error;
    }
  }

  // Helper Methods
  private async ensureNoDuplicateTitle(
    userId: number,
    title: string,
    excludeId?: number,
  ) {
    const duplicateTodo = await this.prisma.todo.findFirst({
      where: {
        userId,
        title,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    if (duplicateTodo) {
      throw new ConflictException('A todo with this title already exists');
    }
  }

  private logError(operation: string, userId: number, error: any) {
    this.logger.error(
      `Error in operation "${operation}" for user ${userId}:`,
      error.stack,
    );
  }
}
