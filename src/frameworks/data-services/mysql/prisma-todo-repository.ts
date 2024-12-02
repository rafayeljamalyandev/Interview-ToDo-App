import { BadRequestException, Injectable } from '@nestjs/common';
import { ITodoGenericRepository } from '../../../core/abstracts/todo-repository.abstract';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaTodoRepository<T> implements ITodoGenericRepository<T> {
  constructor(private readonly prismaService: PrismaService) {}

  async createTodo(item: T): Promise<T> {
    try {
      let itemData = item as Prisma.TodoUncheckedCreateInput;
      return (await this.prismaService.$transaction(async (tx) => {
        return tx.todo.create({
          data: {
            title: itemData.title.trim(),
            userId: itemData.userId,
            completed: itemData.completed,
            description: itemData.description,
            createdAt: new Date(),
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        });
      })) as T;
    } catch (error) {
      // Handle potential database errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle unique constraint violations or other known Prisma errors
        if (error.code === 'P2002') {
          throw new BadRequestException('A similar todo already exists');
        }
      }
      throw error;
    }
  }

  async checkUserExist(id: number): Promise<boolean> {
    let userExists = await this.prismaService.user.findUnique({
      where: { id: id },
      select: { id: true },
    });
    return !userExists;
  }

  async listTodos(userId: number, skip?: number, take?: number) {
    return this.prismaService.todo.findMany({
      where: { userId }, skip , take
    });
  }

  //-------------------------------------------------------------------------------------

  getAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  get(id: number): Promise<T> {
    throw new Error('Method not implemented.');
  }

  update(id: string, item: T) {
    throw new Error('Method not implemented.');
  }
}
