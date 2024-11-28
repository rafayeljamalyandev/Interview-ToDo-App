import { Injectable, NotFoundException } from '@nestjs/common'; // Added NotFoundException for better error handling
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto'; // Added DTO for type-safe input validation

@Injectable()
export class TodosService {
  // Added readonly for immutability
  constructor(private readonly prismaService: PrismaService) {}

  // Changed parameters to use DTO instead of raw parameters
  async createTodo(data: CreateTodoDto, userId: number) {
    // Using structured data object for better clarity
    return await this.prismaService.todo.create({
      data: {
        title: data.title,
        completed: data.completed,
        userId,
      },
    });
  }

  async listTodos(userId: number) {
    try {
      // Added orderBy for consistent data presentation
      const todos = await this.prismaService.todo.findMany({
        where: { userId },
        orderBy: { id: 'desc' },
      });

      // Added empty results handling
      if (!todos.length) {
        throw new NotFoundException('No todos found for this user');
      }

      return todos;
    } catch (error) {
      // Added error type checking
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Added generic error handling
      throw new NotFoundException('Error retrieving todos');
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class TodosService {
//   constructor(private prisma: PrismaService) {}

//   async createTodo(userId: number, title: string) {
//     return this.prisma.todo.create({
//       data: { title, userId },
//     });
//   }

//   async listTodos(userId: number) {
//     return this.prisma.todo.findMany({ where: { userId } });
//   }
// }
