import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  providers: [
    TodosService,
    { provide: 'ITodoRepository', useClass: TodoRepository },
  ],
  controllers: [TodosController],
})
export class TodosModule {}
