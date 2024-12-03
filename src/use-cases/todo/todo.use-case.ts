import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import { CreateTodoDto, CreateUserDto, UpdateTodoDto, UpdateUserDto } from '../../core/dtos';
import { TodoFactoryService } from './todo-factory.service';
import {    Todo } from '../../core';
import {UserNotFoundException} from "../../core/exceptions/user-not-found-exception";
import {UserIdIsRequiredException} from "../../core/exceptions/userid-is-required-exception";
import {TodoTitleCannotBeEmpty} from "../../core/exceptions/todo-title-cannot-be-empty";
import {Prisma} from "@prisma/client";

@Injectable()
export class TodoUseCases {
  constructor(
    private dataServices: IDataServices,
    private todoFactoryService: TodoFactoryService,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    if (!createTodoDto.userId) {
      throw new UserIdIsRequiredException();
    }
    if (!createTodoDto.title || createTodoDto.title.trim().length === 0) {
      throw new TodoTitleCannotBeEmpty();
    }
    const todo = this.todoFactoryService.createNewTodo(createTodoDto);
    const userNotExists = await this.dataServices.todo.checkUserExist(todo.userId);
    if (userNotExists) {
      throw new UserNotFoundException();
    }
    return this.dataServices.todo.createTodo(todo);
  }


  async listTodos(userId: number, skip?: number,take?: number): Promise<Todo[]> {
    if (!userId) {
      throw new UserIdIsRequiredException();
    }
    const userExists = await this.dataServices.todo.checkUserExist(userId);
    if (userExists) {
      throw new UserNotFoundException();
    }
    return this.dataServices.todo.listTodos(userId, skip,take);
  }


  //---------------------------------------------------------------------------------------

  updateTodo(todoId: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = this.todoFactoryService.updateTodo(updateTodoDto);
    return this.dataServices.todo.update(todoId, todo);
  }

  getAllTodos(): Promise<Todo[]> {
    return this.dataServices.todo.getAll();
  }

  getTodoById(id: number): Promise<Todo> {
    return this.dataServices.todo.get(id);
  }
}
