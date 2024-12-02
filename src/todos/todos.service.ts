import { Injectable, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo-dto';
import { UpdateTodoDto} from './dto/update-todo-dto';

@Injectable()
export class TodoService {
  delete: any;
  constructor(private readonly prisma: PrismaService) {}

  // Create a new Todo for a user
  async create(createTodoDto: CreateTodoDto, userId: number) {
    try {
      const newTodo = await this.prisma.todo.create({
        data: {
          ...createTodoDto,
          userId,
        },
      });
      return newTodo;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create Todo');
    }
  }

  // Fetch all Todos for a user
  async getTodosByUser(userId: number) {
    try {
      return await this.prisma.todo.findMany({
        where: { userId },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Todos');
    }
  }

  // Get a specific Todo by ID (only for the authenticated user)
  async getTodoById(todoId: number, userId: number) {
    try {
      const todo = await this.prisma.todo.findFirst({
        where: { id: Number(todoId), userId },
      });
      if (!todo) {
        throw new ForbiddenException('Todo not found or access denied');
      }
      return todo;
    } catch (error) {
      throw error instanceof ForbiddenException
        ? error
        : new InternalServerErrorException('Failed to fetch the Todo');
    }
  }

  // Update a Todo (e.g., mark as completed)
  async updateTodo(todoId: number, updateTodoDto: UpdateTodoDto, userId: number) {
    try {
      const todo = await this.getTodoById(todoId, userId);
      return await this.prisma.todo.update({
        where: { id: Number(todo.id) },
        data: updateTodoDto,
      });
    } catch (error) {
      throw error instanceof ForbiddenException
        ? error
        : new InternalServerErrorException('Failed to update the Todo');
    }
  }

  // Delete a Todo
  async deleteTodo(todoId: number, userId: number) {
    try {
      const todo = await this.getTodoById(todoId, userId);
      return await this.prisma.todo.delete({
        where: { id: todo.id },
      });
    } catch (error) {
      throw error instanceof ForbiddenException
        ? error
        : new InternalServerErrorException('Failed to delete the Todo');
    }
  }

  async searchTodos(userId: number, query: string) {
    try {
      return await this.prisma.todo.findMany({
        where: {
          userId,
          title: {
            contains: query.toLocaleLowerCase(), // Searches for titles containing the query (case-sensitive)
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
    
      throw new Error('Error searching for todos');
    }
  }
  
}
