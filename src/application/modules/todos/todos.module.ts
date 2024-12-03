import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../../infrastructure/database/prisma.module';
import { AtStrategy, RtStrategy } from '../auth/strategies';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [TodosService, AtStrategy, RtStrategy],
  controllers: [TodosController],
})
export class TodosModule {}
