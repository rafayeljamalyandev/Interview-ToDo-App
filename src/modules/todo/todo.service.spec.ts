import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

describe('TodoService', () => {
  let todoService: TodoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TodoService, PrismaService],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('createTodo', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto = { title: 'Test Todo' };
      const userId = 1;

      // Mocking the Prisma create method
      jest.spyOn(prismaService.todo, 'create').mockResolvedValue({
        id: 1,
        title: 'Test Todo',
        completed: false,
        userId,
      });

      const result = await todoService.createTodo(createTodoDto, userId);
      if (Array.isArray(result.data)) {
        expect(result.data[0].title).toBe(createTodoDto.title);
      } else {
        expect(result.data.title).toBe(createTodoDto.title);
      }

      expect(result.status).toBe(201);
      expect(result.message).toBe('TODO created successfully.');
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createTodoDto = { title: 'Test Todo' };
      const userId = 1;

      jest
        .spyOn(prismaService.todo, 'create')
        .mockRejectedValue(new Error('Failed to create TODO'));

      await expect(
        todoService.createTodo(createTodoDto, userId),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('listTodos', () => {
    it('should return all todos for the user', async () => {
      const userId = 1;

      jest
        .spyOn(prismaService.todo, 'findMany')
        .mockResolvedValue([
          { id: 1, title: 'Test Todo', completed: false, userId },
        ]);

      const result = await todoService.listTodos(userId);

      if (Array.isArray(result.data)) {
        // If result.data is an array, test the first item
        expect(result.data[0].title).toBe('Test Todo');
        expect(result.data.length).toBeGreaterThan(0);
      }
      // Check the response status
      expect(result.status).toBe(200);
    });

    it('should throw NotFoundException if no todos found', async () => {
      const userId = 1;

      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);

      await expect(todoService.listTodos(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateTodo', () => {
    it('should update a todo successfully', async () => {
      const userId = 1;
      const updateTodoDto = { title: 'Updated Todo' };
      const todoId = 2;

      jest.spyOn(prismaService.todo, 'update').mockResolvedValue({
        id: todoId,
        title: 'Updated Todo',
        completed: false,
        userId,
      });

      const result = await todoService.updateTodo(
        todoId,
        userId,
        updateTodoDto,
      );

      if (Array.isArray(result.data)) {
        expect(result.data[0].title).toBe(updateTodoDto.title);
      } else {
        expect(result.data.title).toBe(updateTodoDto.title);
      }
      expect(result.status).toBe(200);
      expect(result.message).toBe('Todo updated successfully.');
    });

    it('should throw NotFoundException if todo not found', async () => {
      const userId = 1;
      const updateTodoDto = { title: 'Updated Todo' };
      const todoId = 1;

      jest
        .spyOn(prismaService.todo, 'update')
        .mockRejectedValue(new NotFoundException('Todo not found'));

      await expect(
        todoService.updateTodo(todoId, userId, updateTodoDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const userId = 2;
      const todoId = 2;
      const updateTodoDto = { title: 'Updated Todo' };

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue({
        id: todoId,
        title: 'Original Todo',
        completed: false,
        userId: 1,
      });

      await expect(
        todoService.updateTodo(todoId, userId, updateTodoDto),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      const userId = 1;
      const todoId = 2;

      jest.spyOn(prismaService.todo, 'delete').mockResolvedValue({
        id: todoId,
        title: 'Test Todo',
        completed: false,
        userId,
      });

      const result = await todoService.deleteTodo(todoId, userId);
      expect(result.status).toBe(204);
      expect(result.message).toBe('Todo deleted successfully.');
    });

    it('should throw NotFoundException if todo not found', async () => {
      const userId = 1;
      const todoId = 1;

      jest
        .spyOn(prismaService.todo, 'delete')
        .mockRejectedValue(new NotFoundException('Todo not found'));

      await expect(todoService.deleteTodo(todoId, userId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const userId = 2;
      const todoId = 2; // Different user ID

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue({
        id: todoId,
        title: 'Original Todo',
        completed: false,
        userId: 1,
      });

      await expect(todoService.deleteTodo(todoId, userId)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id successfully', async () => {
      const userId = 1;
      const todoId = 2;

      jest.spyOn(prismaService.todo, 'findUnique').mockResolvedValue({
        id: todoId,
        title: 'Test Todo',
        completed: false,
        userId,
      });

      const result = await todoService.getTodoById(todoId, userId);

      if (Array.isArray(result.data)) {
        expect(result.data[0].id).toBe(todoId);
      } else {
        expect(result.data.id).toBe(todoId);
      }
      expect(result.status).toBe(200);
      expect(result.message).toBe('Todo retrieved successfully.');
    });

    it('should throw NotFoundException if todo not found', async () => {
      const userId = 1;
      const todoId = 1;

      jest.spyOn(prismaService.todo, 'findUnique').mockResolvedValue(null);

      await expect(
        todoService.getTodoById(todoId, userId),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const userId = 2;
      const todoId = 2;

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue({
        id: todoId,
        title: 'Original Todo',
        completed: false,
        userId: 1,
      });

      await expect(
        todoService.getTodoById(todoId, userId),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
