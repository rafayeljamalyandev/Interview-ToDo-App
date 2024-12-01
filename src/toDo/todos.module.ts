import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { JwtAuthGuard } from '../auth/auth.guard';

@Module({
  providers: [TodosService, JwtAuthGuard],
  controllers: [TodosController],
})
export class TodosModule {}
