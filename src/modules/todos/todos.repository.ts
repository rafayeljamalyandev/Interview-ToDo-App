import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/db/prisma.service';
import { Todo } from '@prisma/client';
import { ITodosCreate } from './v1/interface/todos.interface';
import { ReqGetListTodoDTO } from './v1/dto/request.dto';
import { link } from 'fs';

@Injectable()
export class TodosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Todo> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async findMany(
    props: ReqGetListTodoDTO,
  ): Promise<{ data: Todo[]; count: number }> {
    let where: Partial<Todo> = {};

    //Handle where props, adjust as needed
    if (props.userId) {
      Object.assign(where, { userId: props.userId });
    }

    //Handle Pagination
    const skip = (props.page - 1) * Number(props.limit);
    const orderBy = {
      [props.sort]: props.order.toLowerCase() === 'asc' ? 'asc' : 'desc',
    };

    const [data, count] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        orderBy,
        skip,
        take: Number(props.limit),
      }),
      this.prisma.todo.count({ where }),
    ]);

    return { data, count };
  }

  async create(data: ITodosCreate): Promise<Todo> {
    return this.prisma.todo.create({ data });
  }
}
