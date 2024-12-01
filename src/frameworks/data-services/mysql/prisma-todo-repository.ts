import { Injectable } from '@nestjs/common';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTodoRepository<T> implements ITodoGenericRepository<T> {
  constructor(private readonly prismaService: PrismaService) {
  }

  getUserTodos(userId: number) {
    throw new Error('Method not implemented.');
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

  async create(item: T): Promise<T> {
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

  async findById(id: string): Promise<Notification | null> {
    // const notificationPrismaData =
    //   await this.prismaService.notification.findUnique({
    //     where: { id },
    //   });
    //
    // if (!notificationPrismaData) {
    //   return null;
    // }
    //
    // const notification = PrismaNotificationMapper.toDomain(
    //   notificationPrismaData,
    // );

    throw new Error('Method not implemented.');

  }

  async save(notification: Notification): Promise<void> {
    // const notificationPrismaData =
    //   PrismaNotificationMapper.toPrisma(notification);
    //
    // await this.prismaService.notification.update({
    //   where: { id: notification.id },
    //   data: notificationPrismaData,
    // });
    throw new Error('Method not implemented.');

  }

  async countByRecipientId(recipientId: string): Promise<number> {
    // const count = await this.prismaService.notification.count({
    //   where: { recipientId },
    // });
    //
    // return count;
    throw new Error('Method not implemented.');

  }

}
