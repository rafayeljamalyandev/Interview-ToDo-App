import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async createTodo(dto: CreateDto) {
    return await this.prisma.todo.create({
      data: dto,
    });
  }

  async listTodos(userId: number) {
    return await this.prisma.todo.findMany({ where: { userId } });
  }
}
