import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TodosController } from 'src/controllers/todos.controller';
import { TodosService } from 'src/services/todos.service';
import { PrismaModule } from './prisma.module';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [PrismaModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('todos');
  }
}
