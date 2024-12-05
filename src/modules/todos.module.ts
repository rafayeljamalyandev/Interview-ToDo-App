import { Module } from '@nestjs/common';
import { TodosController } from 'src/controllers/todos.controller';
import { TodosService } from 'src/services/todos.service';

@Module({
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
