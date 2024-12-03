import { Test, TestingModule } from '@nestjs/testing';
import { TodosServiceV1 } from './todos.service-v1';
import { TodosRepository } from '../todos.repository';
import { ReqCreateTodoDTO, ReqGetListTodoDTO } from './dto/request.dto';
import { ResCreateTodoDTO } from './dto/response.dto';

describe('TodosServiceV1', () => {
  let todosService: TodosServiceV1;
  let todosRepositoryMock: jest.Mocked<TodosRepository>;

  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    userId: 1,
    completed: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosServiceV1,
        {
          provide: TodosRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    todosService = module.get<TodosServiceV1>(TodosServiceV1);
    todosRepositoryMock = module.get(TodosRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const reqBody: ReqCreateTodoDTO = {
        title: 'New Todo',
        userId: 1,
      };

      const resTodo: ResCreateTodoDTO = {
        ...reqBody,
        id: 1,
        completed: false,
      };

      todosRepositoryMock.create.mockResolvedValue(resTodo);

      const result = await todosService.createTodo(reqBody);

      expect(todosRepositoryMock.create).toHaveBeenCalledWith({
        ...reqBody,
        completed: false,
      });
      expect(result).toEqual(resTodo);
    });
  });

  describe('listTodos', () => {
    it('should return a list of todos with count', async () => {
      const reqProps: ReqGetListTodoDTO = {
        userId: 1,
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'asc',
      };

      const mockTodos = [mockTodo];
      const mockResponse = { data: mockTodos, count: 1 };

      todosRepositoryMock.findMany.mockResolvedValue(mockResponse);

      const result = await todosService.listTodos(reqProps);

      expect(todosRepositoryMock.findMany).toHaveBeenCalledWith(reqProps);
      expect(result).toEqual(mockResponse);
    });
  });
});
