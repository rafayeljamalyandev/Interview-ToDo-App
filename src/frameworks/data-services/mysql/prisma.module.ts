import { Module } from '@nestjs/common';
import { IDataServices } from '../../../core';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './prisma-user-repository';
import { IUserGenericRepository } from '../../../core/abstracts/user-repository.abstract';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { PrismaTodoRepository } from './prisma-todo-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: IDataServices,
      useClass: PrismaTodoRepository,
    },
  ],
  exports: [
    IDataServices,
  ],
})
export class DatabaseModule {}
