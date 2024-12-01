import { Injectable } from '@nestjs/common';
import { Todo } from '../../core/entities';
import { CreateTodoDto, UpdateTodoDto } from '../../core/dtos';

@Injectable()
export class TodoFactoryService {
  createNewTodo(createTodoDto: CreateTodoDto) {
    const newTodo = new Todo();
    newTodo.title = createTodoDto.title;
    newTodo.description = createTodoDto.description;
    newTodo.completed = createTodoDto.completed;
    newTodo.userId = createTodoDto.userId;
    return newTodo;
  }

  updateTodo(updateTodoDto: UpdateTodoDto) {
    const newTodo = new Todo();
    newTodo.title = updateTodoDto.title;
    newTodo.description = updateTodoDto.description;
    newTodo.completed = updateTodoDto.completed;
    newTodo.userId = updateTodoDto.userId;
    return newTodo;
  }
}
