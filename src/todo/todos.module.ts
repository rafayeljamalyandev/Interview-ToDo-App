import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TodosService, UsersService, PrismaService],
  controllers: [TodosController],
})
export class TodosModule {}
