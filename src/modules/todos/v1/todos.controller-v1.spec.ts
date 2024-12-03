import { Test, TestingModule } from '@nestjs/testing';
import { TodosControllerV1 } from './todos.controller-v1';
import { TodosServiceV1 } from './todos.service-v1';
import { ReqCreateTodoDTO, ReqGetListTodoDTO } from './dto/request.dto';
import { ResCreateTodoDTO } from './dto/response.dto';
import { AuthGuard } from '../../../middlewares/guards/auth.guard';

describe('TodosControllerV1', () => {
  let todosController: TodosControllerV1;
  let todosServiceMock: jest.Mocked<TodosServiceV1>;

  const userId = 1; // Mock User id

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosControllerV1],
      providers: [
        {
          provide: TodosServiceV1,
          useValue: {
            createTodo: jest.fn(),
            listTodos: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock AuthGuard to always return true
      .compile();

    todosController = module.get<TodosControllerV1>(TodosControllerV1);
    todosServiceMock = module.get(TodosServiceV1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call createTodo with the correct parameters', async () => {
      const reqBody: ReqCreateTodoDTO = {
        title: 'Test Todo',
        userId, // Mock User id
      };

      const resBody: ResCreateTodoDTO = {
        id: 1,
        title: 'Test Todo',
        userId,
        completed: false,
      };

      todosServiceMock.createTodo.mockResolvedValue(resBody);

      const result = await todosController.create(reqBody, userId);

      expect(todosServiceMock.createTodo).toHaveBeenCalledWith(reqBody);
      expect(result).toEqual(resBody);
    });
  });

  describe('list', () => {
    it('should call listTodos with the correct parameters', async () => {
      const reqQuery: ReqGetListTodoDTO = {
        page: 1,
        limit: 10,
        sort: 'id',
        order: 'asc',
        userId, // Mock User id
      };

      const mockResponse = {
        data: [
          {
            id: 1,
            title: 'Test Todo',
            userId,
            completed: false,
          },
        ],
        count: 1,
      };

      todosServiceMock.listTodos.mockResolvedValue(mockResponse);

      const result = await todosController.list(reqQuery, userId);

      expect(todosServiceMock.listTodos).toHaveBeenCalledWith(reqQuery);
      expect(result).toEqual(mockResponse);
    });
  });
});
