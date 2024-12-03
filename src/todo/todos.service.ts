import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dtos/todo.dto';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';
import { Todo } from './models/todo.model';
import { ITodoRepository } from './models/todo.repository.intf';
import { IUserRepository } from 'src/auth/models/repository.intf';

@Injectable()
export class TodoService {
  constructor(
    @Inject('ITodoRepository') private readonly todoRepository: ITodoRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async createTodo(
    userId: string,
    TodoInfo: CreateTodoDto,
  ): Promise<ServiceResponse> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        return errorResponse('User Not Found!', HttpStatus.BAD_REQUEST);
      }

      const todo = new Todo(null, TodoInfo.title, false, userId);
      const newTodo = await this.todoRepository.createTodo(todo);

      return successResponse(newTodo, 201);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async getUserTodoList(userId: string) {
    try {
      const todoList = await this.todoRepository.getTodoList(userId);

      return successResponse(todoList);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }
}
