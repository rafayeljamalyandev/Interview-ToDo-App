import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dtos/todo.dto';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';
import { Todo } from './models/todo.model';
import { ITodoRepository } from './models/todo.repository.intf';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async createTodo(
    userId: string,
    TodoInfo: CreateTodoDto,
  ): Promise<ServiceResponse> {
    try {
      const todo = new Todo(null, TodoInfo.title, false, userId);
      const newTodo = await this.todoRepository.createTodo(todo);

      return successResponse(newTodo);
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
