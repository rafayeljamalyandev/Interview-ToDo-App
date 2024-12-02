import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { IUserGenericRepository } from '../../../core/abstracts/user-repository.abstract';
import { User } from '../../../core';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaUserRepository<T> implements IUserGenericRepository<T> {
  constructor(private readonly prismaService: PrismaService) {}

  async register(item: T): Promise<T> {
    return (await this.prismaService.user.create({
      data: {
        ...(item as Prisma.UserCreateInput),
        createdAt: new Date(),
      },
    })) as T;
  }

  async login(email: string, password: string): Promise<T> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user as T;
  }

  //-----------------------------------------------------------------------------

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
