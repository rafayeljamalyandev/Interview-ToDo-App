import { Module } from '@nestjs/common';
import { TodosServiceV1 } from './v1/todos.service-v1';
import { TodosControllerV1 } from './v1/todos.controller-v1';
import { DbModule } from 'src/config/db/prisma.module';
import { TodosRepository } from './todos.repository';

@Module({
  imports: [DbModule],
  providers: [TodosServiceV1, TodosRepository],
  controllers: [TodosControllerV1],
})
export class TodosModule {}
