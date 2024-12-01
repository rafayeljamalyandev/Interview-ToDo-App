import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { IUserGenericRepository } from '../../../core/abstracts/user-repository.abstract';
import { User } from '../../../core';

@Injectable()
export class PrismaUserRepository<T> implements IUserGenericRepository<T> {
  constructor(private readonly prismaService: PrismaService) {
  }

  async register(item: T): Promise<T> {
    return await this.prismaService.user.create({
      data: item as any,
    }) as any;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return jwt.sign({ userId: user.id }, 'some_secret_key');
    throw new Error('Method not implemented.');
  }

  removeUser(id: number) {
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


  // login(item: T): Promise<T> {
  //   await this.prismaService.user.create({
  //     data: item,
  //   });
  // }
  // removeUser(id: string) {
  //     throw new Error('Method not implemented.');
  // }
  // getAll(): Promise<T[]> {
  //     throw new Error('Method not implemented.');
  // }
  // get(id: number): Promise<T> {
  //     throw new Error('Method not implemented.');
  // }
  // update(id: string, item: T) {
  //     throw new Error('Method not implemented.');
  // }
//-----------------------------------------------------------------------------
  // async create(notification: Notification): Promise<void> {
  //
  //   await this.prismaService.notification.create({
  //     data: notificationPrismaData,
  //   });
  // }
  //
  // async findById(id: string): Promise<Notification | null> {
  //   const notificationPrismaData =
  //     await this.prismaService.notification.findUnique({
  //       where: { id },
  //     });
  //
  //   if (!notificationPrismaData) {
  //     return null;
  //   }
  //
  //   const notification = PrismaNotificationMapper.toDomain(
  //     notificationPrismaData,
  //   );
  //
  //   return notification;
  // }
  //
  // async save(notification: Notification): Promise<void> {
  //   const notificationPrismaData =
  //     PrismaNotificationMapper.toPrisma(notification);
  //
  //   await this.prismaService.notification.update({
  //     where: { id: notification.id },
  //     data: notificationPrismaData,
  //   });
  // }


}
