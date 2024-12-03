import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { TodosService } from './todos.service';
import { Test, TestingModule } from '@nestjs/testing';

const prismaMock = {
  todo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('TodoService', () => {
  let service: TodosService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prisma = module.get<PrismaService>(PrismaService);

    prismaMock.todo.create.mockClear();
    prismaMock.todo.findMany.mockClear();
    prismaMock.todo.findUnique.mockClear();
    prismaMock.todo.update.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listAllTodos', () => {
    it('should return an array of todos', async () => {
      const existingTodos = [
        { id: 1, title: 'Test Todo 1', completed: false, userId: 1 },
        { id: 2, title: 'Test Todo 2', completed: false, userId: 1 },
        { id: 3, title: 'Test Todo 3', completed: false, userId: 2 },
      ];
      prismaMock.todo.findMany.mockResolvedValue(existingTodos);

      const todos = await service.listAllTodos();
      expect(todos).toEqual(existingTodos);
    });
  });

  describe('listTodosByUserId', () => {
    it('should get user todos', () => {
      const userId = 1;
      const userTodos = [
        { id: 1, title: 'Test Todo 1', completed: false, userId },
        { id: 2, title: 'Test Todo 2', completed: false, userId },
      ];
      prismaMock.todo.findMany.mockResolvedValue(userTodos);

      expect(service.listTodosByUserId(userId)).resolves.toEqual(userTodos);
    });
  });

  describe('createTodo', () => {
    it('should successfully create a todo', async () => {
      const userId = 1;
      const newTodo = {
        id: 1,
        title: 'Test Todo 1',
        complete: false,
        userId,
      };

      prismaMock.todo.create.mockResolvedValue(newTodo);

      expect(service.createTodo(newTodo, userId)).resolves.toEqual(newTodo);
    });
  });

  describe('updateTodoById', () => {
    it('should call the update method', async () => {
      const userId = 1;
      const todo = {
        id: 1,
        title: 'Test Todo 1',
        completed: false,
        userId,
      };

      prismaMock.todo.findUnique.mockReturnValue(todo);
      prismaMock.todo.update.mockReturnValue(todo);

      const updatedTodo = await service.updateTodoById(
        todo.id,
        {
          title: 'Test Todo 11',
        },
        userId,
      );

      expect(updatedTodo).toEqual(todo);
    });
  });
});
