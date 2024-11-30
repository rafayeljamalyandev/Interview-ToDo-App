import { Injectable } from '@nestjs/common';
import { Todo } from '../../core/entities';
import { CreateTodoDto, UpdateTodoDto } from '../../core/dtos';

@Injectable()
export class TodoFactoryService {
  createNewTodo(createTodoDto: CreateTodoDto) {
    const newTodo = new Todo();
    newTodo.title = createTodoDto.title;
    newTodo.description = createTodoDto.description;
    newTodo.dueDate = createTodoDto.dueDate;
    newTodo.state = createTodoDto.state;
    newTodo.priority = createTodoDto.priority;
    newTodo.userId = createTodoDto.userId;
    return newTodo;
  }

  updateTodo(updateTodoDto: UpdateTodoDto) {
    const newTodo = new Todo();
    newTodo.title = updateTodoDto.title;
    newTodo.description = updateTodoDto.description;
    newTodo.dueDate = updateTodoDto.dueDate;
    newTodo.state = updateTodoDto.state;
    newTodo.priority = updateTodoDto.priority;
    newTodo.userId = updateTodoDto.userId;
    return newTodo;
  }
}
