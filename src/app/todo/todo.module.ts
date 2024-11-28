import { Module } from '@nestjs/common';

import { TodosModule } from 'src/services/todos/todos.module';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TokenModule } from 'src/common/token/token.module';

@Module({
  imports: [TodosModule, TokenModule],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
