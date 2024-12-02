import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../../src/todos/todos.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  let prisma: PrismaService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createDto = { title: 'Test Todo', description: 'Test Description' };
      const userId = 1;
      const newTodo = { id: 1, ...createDto, userId };

      mockPrismaService.todo.create.mockResolvedValue(newTodo);

      const result = await service.create(createDto, userId);
      expect(result).toEqual(newTodo);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { ...createDto, userId },
      });
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockPrismaService.todo.create.mockRejectedValue(new Error());

      await expect(service.create({ title: 'Fail' }, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTodosByUser', () => {
    it('should fetch todos for a user', async () => {
      const todos = [{ id: 1, title: 'Test', userId: 1 }];
      mockPrismaService.todo.findMany.mockResolvedValue(todos);

      const result = await service.getTodosByUser(1);
      expect(result).toEqual(todos);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { id: 'desc' },
      });
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockPrismaService.todo.findMany.mockRejectedValue(new Error());

      await expect(service.getTodosByUser(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTodoById', () => {
    it('should fetch a todo by ID', async () => {
      const todo = { id: 1, title: 'Test', userId: 1 };
      mockPrismaService.todo.findFirst.mockResolvedValue(todo);

      const result = await service.getTodoById(1, 1);
      expect(result).toEqual(todo);
      expect(prisma.todo.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
    });

    it('should throw ForbiddenException if the todo is not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.getTodoById(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const todo = { id: 1, title: 'Old Title', userId: 1 };
      const updateDto = { title: 'New Title' };
      const updatedTodo = { ...todo, ...updateDto };

      mockPrismaService.todo.findFirst.mockResolvedValue(todo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.updateTodo(1, updateDto, 1);
      expect(result).toEqual(updatedTodo);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should throw ForbiddenException if the todo does not exist', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.updateTodo(1, {}, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const todo = { id: 1, title: 'Test', userId: 1 };
      mockPrismaService.todo.findFirst.mockResolvedValue(todo);
      mockPrismaService.todo.delete.mockResolvedValue(todo);

      const result = await service.deleteTodo(1, 1);
      expect(result).toEqual(todo);
      expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw ForbiddenException if the todo does not exist', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.deleteTodo(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('searchTodos', () => {
    it('should return todos matching the query', async () => {
      const todos = [{ id: 1, title: 'Test Todo', userId: 1 }];
      mockPrismaService.todo.findMany.mockResolvedValue(todos);

      const result = await service.searchTodos(1, 'Test');
      expect(result).toEqual(todos);
      expect(prisma.todo.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          title: { contains: 'test' },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should throw an error if the search fails', async () => {
      mockPrismaService.todo.findMany.mockRejectedValue(new Error());

      await expect(service.searchTodos(1, 'Test')).rejects.toThrow(Error);
    });

    describe('Error Handling in TodoService', () => {
  describe('create', () => {
    it('should throw InternalServerErrorException when database fails', async () => {
      mockPrismaService.todo.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create({ title: 'Test' }, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTodoById', () => {
    it('should throw ForbiddenException if the todo is not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.getTodoById(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      mockPrismaService.todo.findFirst.mockRejectedValue(new Error('Database error'));

      await expect(service.getTodoById(1, 1)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('searchTodos', () => {
    it('should throw InternalServerErrorException when search fails', async () => {
      mockPrismaService.todo.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.searchTodos(1, 'Test')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateTodo', () => {
    it('should throw ForbiddenException if the todo is not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.updateTodo(1, { title: 'Update' }, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      mockPrismaService.todo.update.mockRejectedValue(new Error('Database error'));

      await expect(
        service.updateTodo(1, { title: 'Update' }, 1),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});


  });
});
