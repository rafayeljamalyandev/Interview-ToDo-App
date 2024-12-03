import { Injectable } from '@nestjs/common';
import { ReqCreateTodoDTO, ReqGetListTodoDTO } from './dto/request.dto';
import { ResCreateTodoDTO } from './dto/response.dto';
import { TodosRepository } from '../todos.repository';

@Injectable()
export class TodosServiceV1 {
  constructor(private todosRepository: TodosRepository) {}

  async createTodo(body: ReqCreateTodoDTO): Promise<ResCreateTodoDTO> {
    const newTodo = {
      ...body,
      completed: false,
    };

    return await this.todosRepository.create(newTodo);
  }

  async listTodos(
    props: ReqGetListTodoDTO,
  ): Promise<{ data: ReqGetListTodoDTO[]; count: number }> {
    return await this.todosRepository.findMany(props);
  }
}
