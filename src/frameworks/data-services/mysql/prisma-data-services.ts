import { ITodoGenericRepository } from 'src/core/abstracts/todo-repository.abstract';
import { IUserGenericRepository } from 'src/core/abstracts/user-repository.abstract';
import { IDataServices, Todo, User } from '../../../core';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDataServices implements IDataServices {
  constructor(private readonly prismaService: PrismaService) {
  }

  user: IUserGenericRepository<User>;
    todo: ITodoGenericRepository<Todo>;

  get users() {
    return this.prismaService.user;
  }

  get todos() {
    return this.prismaService.todo;
  }


}