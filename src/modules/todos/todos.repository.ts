import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/db/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Todo> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }
}
