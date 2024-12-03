import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosDto } from './dto/list-todos.dto';
import { Todo } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  // Using CreateTodoDto as the argument to validate the incoming data
  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, userId } = createTodoDto;

    // Check if user exists
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new HttpException('User with the provided userId does not exist', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.prisma.todo.create({
        data: { title, userId, completed: false },
      });
    } catch (error) {
      console.error('Database error:', error);
      throw new HttpException('Error creating todo: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Using ListTodosDto as the argument to validate the incoming query
  async listTodos(listTodosDto: ListTodosDto): Promise<Todo[]> {
    const { userId } = listTodosDto;
    // Validate userId is present and correct (class-validator in DTO should handle it)
    if (!userId || userId <= 0) {
      throw new HttpException('Invalid userId provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const todos = await this.prisma.todo.findMany({ where: { userId } });
      return todos; // Will return an empty array if no todos are found
    } catch (error) {
      console.error('Database error:', error);
      throw new HttpException('Error fetching todos: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
