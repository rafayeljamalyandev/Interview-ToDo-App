import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from '../../lib/middleware';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  providers: [TodosService, PrismaService],
  controllers: [TodosController],
})
export class TodosModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TodosController);
  }
}
