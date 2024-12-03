import { Module } from '@nestjs/common';
import { TodoService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  providers: [
    TodoService,
    { provide: 'ITodoRepository', useClass: TodoRepository },
  ],
  controllers: [TodosController],
})
export class TodosModule {}
