// src/todos/todos.service.spec.ts
import { Test } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let todosService: TodosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    todosService = moduleRef.get<TodosService>(TodosService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('listTodos', () => {
    it('should return todos for valid user', async () => {
      const mockTodos = [
        { id: 1, title: 'Test Todo', completed: false, userId: 1 },
      ];

      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue(mockTodos);

      const result = await todosService.listTodos(1);
      expect(result).toEqual(mockTodos);
    });

    it('should throw NotFoundException when no todos found', async () => {
      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);

      await expect(todosService.listTodos(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
