import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from '../src/todos.service';
import { PrismaService } from '../src/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('TodosService', () => {
  let todosService: TodosService;
  let prismaService: PrismaService;

  // Mock the PrismaService
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should successfully create a todo', async () => {
      const userId = 1;
      const title = faker.lorem.sentence();
      const createTodoDto = { userId, title };

      const user = { id: userId, email: faker.internet.email() };

      // Mock the user lookup
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);

      // Mock the todo creation
      const createdTodo: Todo = { id: faker.number.int(), userId, title, completed: false };
      mockPrismaService.todo.create.mockResolvedValueOnce(createdTodo);

      const result = await todosService.createTodo(createTodoDto);

      expect(result).toEqual(createdTodo);
      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: { title, userId, completed: false },
      });
    });

    it('should throw error if user does not exist', async () => {
      const userId = 999; // Non-existing userId
      const title = faker.lorem.sentence();
      const createTodoDto = { userId, title };

      // Mock the user lookup to return null (user not found)
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      try {
        await todosService.createTodo(createTodoDto);
      } catch (error) {
        expect(error instanceof HttpException).toBeTruthy();
        expect(error.response).toBe('User with the provided userId does not exist');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw error if there is a database issue', async () => {
      const userId = 1;
      const title = faker.lorem.sentence();
      const createTodoDto = { userId, title };

      // Mock the user lookup to return a user
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: userId, email: faker.internet.email() });

      // Simulate a database error when creating the todo
      mockPrismaService.todo.create.mockRejectedValueOnce(new Error('Database error'));

      try {
        await todosService.createTodo(createTodoDto);
      } catch (error) {
        expect(error instanceof HttpException).toBeTruthy();
        expect(error.response).toBe('Error creating todo: Database error');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('listTodos', () => {
    it('should return a list of todos for a valid userId', async () => {
      const userId = 1;
      const todos = [
        { id: 1, userId, title: faker.lorem.sentence() },
        { id: 2, userId, title: faker.lorem.sentence() },
      ];

      // Mock the todo retrieval
      mockPrismaService.todo.findMany.mockResolvedValueOnce(todos);

      const listTodosDto = { userId };
      const result = await todosService.listTodos(listTodosDto);

      expect(result).toEqual(todos);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should throw error if userId is invalid', async () => {
      const listTodosDto = { userId: -1 }; // Invalid userId

      try {
        await todosService.listTodos(listTodosDto);
      } catch (error) {
        expect(error instanceof HttpException).toBeTruthy();
        expect(error.response).toBe('Invalid userId provided');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return an empty array if no todos are found', async () => {
      const userId = 1;

      // Mock the todo retrieval to return an empty array
      mockPrismaService.todo.findMany.mockResolvedValueOnce([]);

      const listTodosDto = { userId };
      const result = await todosService.listTodos(listTodosDto);

      expect(result).toEqual([]);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({ where: { userId } });
    });

    it('should throw error if there is a database issue', async () => {
      const userId = 1;

      // Simulate a database error when fetching todos
      mockPrismaService.todo.findMany.mockRejectedValueOnce(new Error('Database error'));

      const listTodosDto = { userId };
      try {
        await todosService.listTodos(listTodosDto);
      } catch (error) {
        expect(error instanceof HttpException).toBeTruthy();
        expect(error.response).toBe('Error fetching todos: Database error');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
