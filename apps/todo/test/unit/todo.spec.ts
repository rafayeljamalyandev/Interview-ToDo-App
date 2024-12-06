import { PrismaService } from '../../../../libs/common/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../../src/todo.service';
import { CreateTodoDTO } from '../../src/dto/create-todo.dto';

if (!process.env.DATABASE_URL.endsWith('test')) {
  console.warn('Tests are only allowed to run on test database.');
  process.exit(0);
}

describe('TodosService', () => {
  let todosService: TodoService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    todosService = module.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const req = { user: { id: 1 } };
      const todo: CreateTodoDTO = { title: 'Test Todo' };

      mockPrismaService.todo.create.mockResolvedValue(todo);

      const result = await todosService.createTodo(req as any, todo);
      expect(result).toEqual(todo);
      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: { title: todo.title, userId: req.user.id },
      });
    });
  });

  describe('listTodos', () => {
    const req = { user: { id: 1 } };
    const query = { limit: 10, page: 1 };

    it('should return paginated todos for the user', async () => {
      const mockTodos = [
        { id: 'todo-1', title: 'Todo 1' },
        { id: 'todo-2', title: 'Todo 2' },
      ];
      const totalCount = 2;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(totalCount);

      const result = await todosService.listTodos(req as any, query);

      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId: req.user.id },
        skip: 0,
        take: query.limit,
      });
      expect(mockPrismaService.todo.count).toHaveBeenCalledWith({
        where: { userId: req.user.id },
      });
      expect(result).toEqual({
        totalCount,
        data: mockTodos,
      });
    });

    it('should handle pagination correctly', async () => {
      query.page = 2;
      const mockTodos = [{ id: 'todo-3', title: 'Todo 3' }];
      const totalCount = 3;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(totalCount);

      const result = await todosService.listTodos(req as any, query);

      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId: req.user.id },
        skip: 10,
        take: query.limit,
      });
      expect(result).toEqual({
        totalCount,
        data: mockTodos,
      });
    });

    it('should default to limit of 10 if not provided', async () => {
      query.limit = undefined;
      const mockTodos = [{ id: 'todo-4', title: 'Todo 4' }];
      const totalCount = 1;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(totalCount);

      const result = await todosService.listTodos(req as any, query);

      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId: req.user.id },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        totalCount,
        data: mockTodos,
      });
    });
  });
});
