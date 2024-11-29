import { Module } from '@nestjs/common';
import { TodosController } from '../../controllers/todos.controller';
import { TodoService } from './todos.service';

@Module({
  providers: [TodoService],
  controllers: [TodosController],
})
export class TodosModule {}
