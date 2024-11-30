import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from '../src/todos/todos.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTodoDto = {
      title: 'Test Todo',
      description: 'Test Description',
      dueDate: new Date(),
    };

    const userId = 1;

    it('should create a todo successfully', async () => {
      const expectedTodo = {
        id: 1,
        ...createTodoDto,
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.count.mockResolvedValue(0);
      mockPrismaService.todo.findUnique.mockResolvedValue(null);
      mockPrismaService.todo.create.mockResolvedValue(expectedTodo);

      const result = await service.create(userId, {
        ...createTodoDto,
        dueDate: createTodoDto.dueDate.toISOString(),
      });
      expect(result).toEqual(expectedTodo);
    });

    it('should throw ConflictException when todo limit is reached', async () => {
      mockPrismaService.todo.count.mockResolvedValue(100);

      await expect(
        service.create(userId, {
          ...createTodoDto,
          dueDate: createTodoDto.dueDate.toISOString(),
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    const userId = 1;
    const mockTodos = [
      {
        id: 1,
        title: 'Todo 1',
        completed: false,
        userId,
      },
      {
        id: 2,
        title: 'Todo 2',
        completed: true,
        userId,
      },
    ];

    it('should return all todos for user', async () => {
      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(2);

      const result = await service.findAll(userId, {});
      expect(result.data).toEqual(mockTodos);
      expect(result.meta.total).toBe(2);
    });

    it('should filter todos by completed status', async () => {
      const completedTodos = mockTodos.filter((todo) => todo.completed);
      mockPrismaService.todo.findMany.mockResolvedValue(completedTodos);
      mockPrismaService.todo.count.mockResolvedValue(1);

      const result = await service.findAll(userId, { completed: true });
      expect(result.data).toEqual(completedTodos);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const todoId = 1;

    it('should return a todo if it exists', async () => {
      const mockTodo = {
        id: todoId,
        title: 'Test Todo',
        userId,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(mockTodo);

      const result = await service.findOne(userId, todoId);
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo does not exist', async () => {
      mockPrismaService.todo.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, todoId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    const userId = 1;

    it('should return correct statistics', async () => {
      mockPrismaService.todo.count.mockImplementation((params) => {
        if (params?.where?.completed) return 5;
        if (params?.where?.dueDate) return 2;
        return 10;
      });

      const result = await service.getStats(userId);
      expect(result).toEqual({
        total: 10,
        completed: 5,
        pending: 5,
        dueSoon: 2,
        completionRate: 50,
      });
    });
  });
});
