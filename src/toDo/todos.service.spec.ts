import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, { provide: PrismaService, useValue: mockPrismaService() }],
    }).compile();

    service = module.get<TodosService>(TodosService)  as jest.Mocked<TodosService>;
    prisma = module.get<PrismaService>(PrismaService) as unknown as jest.Mocked<PrismaService>;
});

  it('should create a to-do item successfully', async () => {
    const mockTodo = { id: 1, title: 'Test Todo', userId: 1 };
    prisma.todo.create = jest.fn().mockResolvedValue(mockTodo);

    const result = await service.createTodo({ title: 'Test Todo' }, 1);
    expect(result).toEqual(mockTodo);
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: 'Test Todo', userId: 1 },
    });
  });

  it('should list all to-do items for a user', async () => {
    const mockTodos = [{ id: 1, title: 'Test Todo', userId: 1 }];
    prisma.todo.findMany =  jest.fn().mockResolvedValue(mockTodos);

    const result = await service.listTodos(1);
    expect(result).toEqual(mockTodos);
    expect(prisma.todo.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
  });

  it('should update a to-do item successfully', async () => {
    const mockTodo = { id: 1, title: 'Updated Todo', userId: 1 };
    prisma.todo.findUnique = jest.fn().mockResolvedValue(mockTodo);
    prisma.todo.update =jest.fn().mockResolvedValue(mockTodo);

    const result = await service.updateTodo(1, { title: 'Updated Todo' }, 1);
    expect(result).toEqual(mockTodo);
    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Todo' },
    });
  });

  it('should throw NotFoundException if to-do does not exist', async () => {
    prisma.todo.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.updateTodo(1, { title: 'Updated Todo' }, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user is not authorized', async () => {
    const mockTodo = { id: 1, title: 'Test Todo', userId: 2 };
    prisma.todo.findUnique = jest.fn().mockResolvedValue(mockTodo);

    await expect(service.updateTodo(1, { title: 'Updated Todo' }, 1)).rejects.toThrow(ForbiddenException);
  });
});

function mockPrismaService(): jest.Mocked<PrismaService> {
    return {
      todo: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $on: jest.fn(),
      $use: jest.fn(),
    } as unknown as jest.Mocked<PrismaService>;
  }