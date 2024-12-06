import { PrismaService } from '../../../libs/common/src/prisma/prisma.service';
import { AuthorizedRequest } from '../../../libs/common/src/common/types/authorized-request.type';
import { PaginationQueryDto } from '../../../libs/common/src/common/dto/pagination.dto';
import { PaginatedResponseType } from '../../../libs/common/src/common/types/paginated-response.type';
import { Injectable } from '@nestjs/common';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { ListTodosResponseDto } from './dto/list-todo-dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(req: AuthorizedRequest, todo: CreateTodoDTO) {
    return this.prisma.todo.create({
      data: { title: todo.title, userId: req.user.id },
    });
  }

  async listTodos(
    req: AuthorizedRequest,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseType<ListTodosResponseDto>> {
    const skip = (query?.page - 1) * query?.limit;
    const todos = await this.prisma.todo.findMany({
      where: { userId: req.user.id },
      skip: skip || 0,
      take: query?.limit || 10,
    });

    const totalCount = await this.prisma.todo.count({
      where: { userId: req.user.id },
    });

    return {
      totalCount,
      data: todos,
    };
  }
}
