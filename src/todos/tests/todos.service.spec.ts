import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from '../todos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        dueDate: new Date(), // Added dueDate property
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.todo, 'create').mockResolvedValue(mockTodo);

      const result = await service.create(1, {
        title: 'Test Todo',
        description: 'Test Description',
      });

      expect(result).toEqual(mockTodo);
    });
  });

  // Add more test cases...
});
