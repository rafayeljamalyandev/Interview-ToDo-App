import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let todosService: TodosService;
  let prismaService: PrismaService;

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
            },
          },
        },
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createTodo', () => {
    it('should create a todo for the given user', async () => {
      const userId = 1;
      const title = 'Test Todo';
      const createdTodo = { id: 1, userId, title };
      (jest.spyOn(prismaService.todo, 'create') as jest.Mock).mockResolvedValue(
        createdTodo,
      );

      const result = await todosService.createTodo(userId, title);

      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: { title, userId },
      });
      expect(result).toEqual(createdTodo);
    });
  });

  describe('listTodos', () => {
    it('should return a list of todos for the given user', async () => {
      const userId = 1;
      const todos = [
        { id: 1, userId, title: 'Test Todo 1' },
        { id: 2, userId, title: 'Test Todo 2' },
      ];
      (
        jest.spyOn(prismaService.todo, 'findMany') as jest.Mock
      ).mockResolvedValue(todos);

      const result = await todosService.listTodos(userId);

      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(todos);
    });

    it('should return an empty list if no todos exist for the user', async () => {
      const userId = 1;
      (
        jest.spyOn(prismaService.todo, 'findMany') as jest.Mock
      ).mockResolvedValue([]);

      const result = await todosService.listTodos(userId);

      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual([]);
    });
  });
  describe('completeTodo', () => {
    it('should mark a todo as completed', async () => {
      const userId = 1;
      const todoId = 123;
      const updateData = { completed: true };
      const todo = { id: todoId, userId, title: 'Test Todo', completed: false };
      const updatedTodo = { ...todo, ...updateData };

      (
        jest.spyOn(prismaService.todo, 'findFirst') as jest.Mock
      ).mockResolvedValue(todo);
      (jest.spyOn(prismaService.todo, 'update') as jest.Mock).mockResolvedValue(
        updatedTodo,
      );

      const result = await todosService.completeTodo(todoId, userId);

      expect(prismaService.todo.findFirst).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: updateData,
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException if the todo is not found', async () => {
      const userId = 1;
      const todoId = 123;

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue(null);

      await expect(todosService.completeTodo(todoId, userId)).rejects.toThrow(
        new NotFoundException(`Todo with ID ${todoId} not found`),
      );
    });
  });

  describe('editTodo', () => {
    it('should update the todo title', async () => {
      const userId = 1;
      const todoId = 123;
      const newTitle = 'Updated Title';
      const updateData = { title: newTitle };
      const todo = { id: todoId, userId, title: 'Old Title', completed: false };
      const updatedTodo = { ...todo, ...updateData };

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue(todo);
      jest.spyOn(prismaService.todo, 'update').mockResolvedValue(updatedTodo);

      const result = await todosService.editTodo(todoId, newTitle, userId);

      expect(prismaService.todo.findFirst).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: updateData,
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw NotFoundException if the todo is not found', async () => {
      const userId = 1;
      const todoId = 123;
      const newTitle = 'Updated Title';

      jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue(null);

      await expect(
        todosService.editTodo(todoId, newTitle, userId),
      ).rejects.toThrow(
        new NotFoundException(`Todo with ID ${todoId} not found`),
      );
    });
  });
});
