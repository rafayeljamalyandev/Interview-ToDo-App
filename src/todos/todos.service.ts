import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  Logger 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  private readonly MAX_TODOS = 100;

  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto) {
    try {
      // Check todo limit
      const todoCount = await this.prisma.todo.count({
        where: { userId }
      });

      if (todoCount >= this.MAX_TODOS) {
        throw new ConflictException(`You have reached the maximum limit of ${this.MAX_TODOS} todos`);
      }

      // Check duplicate title
      const existingTodo = await this.prisma.todo.findFirst({
        where: {
          userId,
          title: createTodoDto.title
        }
      });

      if (existingTodo) {
        throw new ConflictException('A todo with this title already exists');
      }

      // Validate due date
      if (createTodoDto.dueDate) {
        const dueDate = new Date(createTodoDto.dueDate);
        if (dueDate < new Date()) {
          throw new BadRequestException('Due date cannot be in the past');
        }
      }

      return await this.prisma.todo.create({
        data: {
          ...createTodoDto,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error creating todo for user ${userId}:`, error.stack);
      throw error;
    }
  }

  async findAll(userId: number, params: { 
    completed?: boolean; 
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'dueDate' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const { 
        completed, 
        search, 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const skip = (page - 1) * limit;

      const where = {
        userId,
        ...(completed !== undefined && { completed }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      };

      const [todos, total] = await Promise.all([
        this.prisma.todo.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.todo.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: todos,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        }
      };
    } catch (error) {
      this.logger.error(`Error fetching todos for user ${userId}:`, error.stack);
      throw error;
    }
  }

  async findOne(userId: number, id: number) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!todo) {
        throw new NotFoundException(
          `Todo with ID ${id} not found or you don't have access to it`
        );
      }

      // Check if todo is due soon (within next 24 hours)
      if (todo.dueDate) {
        const now = new Date();
        const dueDate = new Date(todo.dueDate);
        const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilDue <= 24 && hoursUntilDue > 0 && !todo.completed) {
          todo['dueSoon'] = true;
          todo['hoursRemaining'] = Math.round(hoursUntilDue);
        }
      }

      return todo;
    } catch (error) {
      this.logger.error(
        `Error fetching todo ${id} for user ${userId}:`, 
        error.stack
      );
      throw error;
    }
  }

  async update(userId: number, id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const existingTodo = await this.findOne(userId, id);

      if (updateTodoDto.dueDate) {
        const dueDate = new Date(updateTodoDto.dueDate);
        if (dueDate < new Date()) {
          throw new BadRequestException('Due date cannot be in the past');
        }
      }

      if (updateTodoDto.title && updateTodoDto.title !== existingTodo.title) {
        const duplicateTitle = await this.prisma.todo.findFirst({
          where: {
            userId,
            title: updateTodoDto.title,
            id: { not: id },
          },
        });

        if (duplicateTitle) {
          throw new ConflictException('A todo with this title already exists');
        }
      }

      // Removemos la lógica de completedAt temporalmente
      return await this.prisma.todo.update({
        where: { id },
        data: updateTodoDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error updating todo ${id} for user ${userId}:`, 
        error.stack
      );
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    try {
      await this.findOne(userId, id);

      return await this.prisma.todo.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting todo ${id} for user ${userId}:`, 
        error.stack
      );
      throw error;
    }
  }

  async getStats(userId: number) {
    try {
      const [totalTodos, completedTodos, dueSoonTodos] = await Promise.all([
        this.prisma.todo.count({ 
          where: { userId } 
        }),
        this.prisma.todo.count({
          where: { 
            userId, 
            completed: true 
          },
        }),
        this.prisma.todo.count({
          where: {
            userId,
            completed: false,
            dueDate: {
              lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
              gte: new Date(),
            },
          },
        }),
      ]);

      const pendingTodos = totalTodos - completedTodos;
      const completionRate = totalTodos > 0 
        ? Math.round((completedTodos / totalTodos) * 100)
        : 0;

      return {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        dueSoon: dueSoonTodos,
        completionRate,
      };
    } catch (error) {
      this.logger.error(`Error getting stats for user ${userId}:`, error.stack);
      throw error;
    }
  }

  async markAsCompleted(userId: number, id: number) {
    try {
      await this.findOne(userId, id);

      return await this.prisma.todo.update({
        where: { id },
        data: { 
          completed: true
          // Temporalmente removemos completedAt hasta que Prisma lo reconozca
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error marking todo ${id} as completed for user ${userId}:`, 
        error.stack
      );
      throw error;
    }
  }

  async getDueSoon(userId: number) {
    try {
      return await this.prisma.todo.findMany({
        where: {
          userId,
          completed: false,
          dueDate: {
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
            gte: new Date(),
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error getting due soon todos for user ${userId}:`, error.stack);
      throw error;
    }
  }
}