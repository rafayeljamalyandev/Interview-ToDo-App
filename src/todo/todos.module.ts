import { Module } from '@nestjs/common';
import { TodoService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoRepository } from './repositories/todo.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [
    TodoService,
    { provide: 'ITodoRepository', useClass: TodoRepository },
  ],
  controllers: [TodosController],
})
export class TodosModule {}
