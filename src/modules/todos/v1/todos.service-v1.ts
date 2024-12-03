import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/db/prisma.service';
import { ReqCreateTodoDTO } from './dto/request.dto';
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

  // async listTodos(userId: number) {
  //   return this.prisma.todo.findMany({ where: { userId } });
  // }
}
