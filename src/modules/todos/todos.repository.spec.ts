import { Test, TestingModule } from '@nestjs/testing';
import { TodosRepository } from './todos.repository';
import { PrismaService } from '../../config/db/prisma.service';
import { Todo } from '@prisma/client';
import { ITodosCreate } from './v1/interface/todos.interface';
import { ReqGetListTodoDTO } from './v1/dto/request.dto';

describe('TodosRepository', () => {
  let todosRepository: TodosRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    todo: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    todosRepository = module.get<TodosRepository>(TodosRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a todo when found', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        userId: 1,
        completed: false,
      };

      mockPrismaService.todo.findUnique.mockResolvedValue(mockTodo);

      const result = await todosRepository.findOne(1);

      expect(mockPrismaService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findMany', () => {
    it('should return a list of todos with the count', async () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Test Todo 1', userId: 1, completed: false },
        { id: 2, title: 'Test Todo 2', userId: 1, completed: true },
      ];
      const mockCount = 2;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(mockCount);

      const props: ReqGetListTodoDTO = {
        userId: 1,
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'asc',
      };

      const result = await todosRepository.findMany(props);

      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { id: 'asc' },
        skip: 0,
        take: 10,
      });
      expect(mockPrismaService.todo.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result).toEqual({ data: mockTodos, count: mockCount });
    });
  });

  describe('create', () => {
    it('should create and return a new todo', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        userId: 1,
        completed: false,
      };

      const createData: ITodosCreate = {
        title: 'Test Todo',
        userId: 1,
        completed: false,
      };

      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await todosRepository.create(createData);

      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockTodo);
    });
  });
});
