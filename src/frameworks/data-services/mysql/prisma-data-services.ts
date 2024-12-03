import { ITodoGenericRepository } from 'src/core/abstracts/todo-repository.abstract';
import { IUserGenericRepository } from 'src/core/abstracts/user-repository.abstract';
import { IDataServices } from '../../../core';
import { PrismaService } from './prisma.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaUserRepository } from './prisma-user-repository';
import { User, Todo } from '@prisma/client';
import { PrismaTodoRepository } from './prisma-todo-repository';

@Injectable()
export class PrismaDataServices
  implements IDataServices, OnApplicationBootstrap
{
  constructor(private readonly prismaService: PrismaService) {}

  user: IUserGenericRepository<User>;
  todo: ITodoGenericRepository<Todo>;

  onApplicationBootstrap() {
    this.user = new PrismaUserRepository<User>(this.prismaService);
    this.todo = new PrismaTodoRepository<Todo>(this.prismaService);
  }
}
