import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

const mockPrismaService = {
  todo: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TodosService', () => {
  let service: TodosService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<typeof mockPrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      prisma.todo.create.mockResolvedValue({ id: 1, title: 'Test Todo' });
      prisma.todo.findFirst.mockResolvedValue(null); // No duplicate

      const result = await service.create(1, {
        title: 'Test Todo',
        dueDate: null,
      });
      expect(result).toEqual({ id: 1, title: 'Test Todo' });
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { title: 'Test Todo', dueDate: null, userId: 1 },
        include: { user: { select: { id: true, name: true } } },
      });
    });

    it('should throw a BadRequestException if due date is in the past', async () => {
      await expect(
        service.create(1, { title: 'Test Todo', dueDate: '2000-01-01' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a ConflictException if title is a duplicate', async () => {
      prisma.todo.findFirst.mockResolvedValue({ id: 1, title: 'Test Todo' });
      await expect(
        service.create(1, { title: 'Test Todo', dueDate: null }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated todos', async () => {
      prisma.todo.findMany.mockResolvedValue([{ id: 1, title: 'Test Todo' }]);
      prisma.todo.count.mockResolvedValue(1);

      const result = await service.findAll(1, { page: 1, limit: 10 });
      expect(result).toEqual({
        data: [{ id: 1, title: 'Test Todo' }],
        meta: {
          page: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
          total: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      prisma.todo.findFirst.mockResolvedValue({ id: 1, title: 'Test Todo' });

      const result = await service.findOne(1, 1);
      expect(result).toEqual({ id: 1, title: 'Test Todo' });
    });

    it('should throw a NotFoundException if todo is not found', async () => {
      prisma.todo.findFirst.mockResolvedValue(null);
      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      prisma.todo.findFirst.mockResolvedValueOnce({
        id: 1,
        title: 'Old Title',
      }); // Existing todo
      prisma.todo.findFirst.mockResolvedValueOnce(null); // No duplicate title
      prisma.todo.update.mockResolvedValue({ id: 1, title: 'Updated Title' });

      const result = await service.update(1, 1, { title: 'Updated Title' });
      expect(result).toEqual({ id: 1, title: 'Updated Title' });
    });

    it('should throw a ConflictException if title is a duplicate', async () => {
      prisma.todo.findFirst.mockResolvedValueOnce({
        id: 1,
        title: 'Old Title',
      }); // Existing todo
      prisma.todo.findFirst.mockResolvedValueOnce({
        id: 2,
        title: 'Duplicate Title',
      }); // Duplicate title

      await expect(
        service.update(1, 1, { title: 'Duplicate Title' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      prisma.todo.findFirst.mockResolvedValue({ id: 1, title: 'Test Todo' });
      prisma.todo.delete.mockResolvedValue({ id: 1, title: 'Test Todo' });

      const result = await service.remove(1, 1);
      expect(result).toEqual({ id: 1, title: 'Test Todo' });
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a todo as completed', async () => {
      prisma.todo.findFirst.mockResolvedValue({ id: 1, title: 'Test Todo' });
      prisma.todo.update.mockResolvedValue({
        id: 1,
        title: 'Test Todo',
        completedAt: new Date(),
      });

      const result = await service.markAsCompleted(1, 1);
      expect(result).toHaveProperty('completedAt');
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completedAt: expect.any(Date) },
        include: { user: { select: { id: true, name: true } } },
      });
    });
  });
});
