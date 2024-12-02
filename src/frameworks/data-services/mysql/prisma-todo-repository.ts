import { Injectable } from '@nestjs/common';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTodoRepository<T> implements ITodoGenericRepository<T> {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createTodo(item: T): Promise<T> {
    // const notificationPrismaData =
    //   PrismaNotificationMapper.toPrisma(notification);
    //
    // await this.prismaService.notification.create({
    //   data: notificationPrismaData,
    // });
    return await this.prismaService.todo.create({
      data: item as Prisma.TodoCreateInput,
    }) as T;
  }

  async listTodos(userId: number) {
    return this.prismaService.todo.findMany({ where: { userId } });
  }

  getAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  get(id: number): Promise<T> {
    throw new Error('Method not implemented.');
  }

  update(id: string, item: T) {
    throw new Error('Method not implemented.');
  }




}
