import { Injectable } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import { CreateTodoDto, CreateUserDto, UpdateTodoDto, UpdateUserDto } from '../../core/dtos';
import { TodoFactoryService } from './todo-factory.service';
import {    Todo } from '../../core';

@Injectable()
export class TodoUseCases {
  constructor(
    private dataServices: IDataServices,
    private todoFactoryService: TodoFactoryService,
  ) {}

  getAllTodos(): Promise<Todo[]> {
    return this.dataServices.todo.getAll();
  }

  getTodoById(id: number): Promise<Todo> {
    return this.dataServices.todo.get(id);
  }

  createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoFactoryService.createNewTodo(createTodoDto);
    return this.dataServices.todo.create(todo);
  }

  updateTodo(
    todoId: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = this.todoFactoryService.updateTodo(updateTodoDto);
    return this.dataServices.todo.update(todoId, todo);
  }

  getUserTodos( userId: number,): Promise<Todo[]> {
    return this.dataServices.todo.getUserTodos(userId);
  }

}
