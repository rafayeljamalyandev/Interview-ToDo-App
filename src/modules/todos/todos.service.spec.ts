import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../../prisma.service';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            todo: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createTodo', () => {
    it('should create a todo successfully', async () => {
      const mockTodo = { id: 1, title: 'Test Todo', userId: 1 };
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({ id: 1, name: 'Test User' } as any);
      jest
        .spyOn(prismaService.todo, 'create')
        .mockResolvedValue(mockTodo as any);

      const result = await service.createTodo({ title: 'Test Todo' } as any, 1);

      expect(result).toEqual({
        message: 'Todo created successfully',
        todo: mockTodo,
      });
    });

    it('should throw a ConflictException if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.createTodo({ title: 'Test Todo' } as any, 1),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw an InternalServerErrorException if there is an unexpected error', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.createTodo({ title: 'Test Todo' } as any, 1),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('listTodos', () => {
    it('should list todos for a user', async () => {
      const mockTodos = [
        { id: 1, title: 'Todo 1', userId: 1 },
        { id: 2, title: 'Todo 2', userId: 1 },
      ];
      jest
        .spyOn(prismaService.todo, 'findMany')
        .mockResolvedValue(mockTodos as any);

      const result = await service.listTodos({ userId: 1 });

      expect(result).toEqual({
        message: 'Todos fetched successfully',
        data: { todos: mockTodos },
      });
    });

    it('should throw an InternalServerErrorException if there is an error fetching todos', async () => {
      jest
        .spyOn(prismaService.todo, 'findMany')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.listTodos({ userId: 1 })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
