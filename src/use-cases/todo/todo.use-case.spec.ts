import { Test, TestingModule } from '@nestjs/testing';
import { TodoFactoryService } from './todo-factory.service';
import { IDataServices } from '../../core/abstracts';
import { CreateTodoDto, UpdateTodoDto } from '../../core/dtos';
import { Todo } from '../../core';
import { UserNotFoundException } from '../../core/exceptions/user-not-found-exception';
import { UserIdIsRequiredException } from '../../core/exceptions/userid-is-required-exception';
import { TodoTitleCannotBeEmpty } from '../../core/exceptions/todo-title-cannot-be-empty';
import {TodoUseCases} from "./todo.use-case";

describe('TodoUseCases', () => {
  let todoUseCases: TodoUseCases;
  let dataServices: IDataServices;
  let todoFactoryService: TodoFactoryService;

  beforeEach(async () => {
    const mockDataServices = {
      todo: {
        createTodo: jest.fn(),
        listTodos: jest.fn(),
        checkUserExist: jest.fn(),
        update: jest.fn(),
        getAll: jest.fn(),
        get: jest.fn(),
      },
      user: {},
    } as unknown as IDataServices;

    const mockTodoFactoryService = {
      createNewTodo: jest.fn(),
      updateTodo: jest.fn(),
    } as TodoFactoryService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoUseCases,
        { provide: IDataServices, useValue: mockDataServices },
        { provide: TodoFactoryService, useValue: mockTodoFactoryService },
      ],
    }).compile();

    todoUseCases = module.get<TodoUseCases>(TodoUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    todoFactoryService = module.get<TodoFactoryService>(TodoFactoryService);
  });

  describe('createTodo', () => {
    it('should throw UserIdIsRequiredException when userId is not provided', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        userId: null,
      };

      await expect(todoUseCases.createTodo(createTodoDto))
          .rejects.toThrow(UserIdIsRequiredException);
    });

    it('should throw TodoTitleCannotBeEmpty when title is empty', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Title',
        description: 'Test Description',
        completed: false,
        userId: 1,
      };

      await expect(todoUseCases.createTodo(createTodoDto))
          .rejects.toThrow(TodoTitleCannotBeEmpty);
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        userId: 1,
      };
      const newTodo: Todo = {
        ...createTodoDto,
        id: 1,
        createdAt: new Date(),
      };

      jest.spyOn(todoFactoryService, 'createNewTodo').mockReturnValue(newTodo);

      jest.spyOn(dataServices.todo, 'checkUserExist').mockResolvedValue(true);

      await expect(todoUseCases.createTodo(createTodoDto))
          .rejects.toThrow(UserNotFoundException);
    });

    it('should successfully create a todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        userId: 1,
      };
      const newTodo: Todo = {
        ...createTodoDto,
        id: 1,
        createdAt: new Date(),
      };

      jest.spyOn(todoFactoryService, 'createNewTodo').mockReturnValue(newTodo);

      jest.spyOn(dataServices.todo, 'checkUserExist').mockResolvedValue(false);

      jest.spyOn(dataServices.todo, 'createTodo').mockResolvedValue(newTodo);

      const result = await todoUseCases.createTodo(createTodoDto);

      expect(todoFactoryService.createNewTodo).toHaveBeenCalledWith(createTodoDto);
      expect(dataServices.todo.checkUserExist).toHaveBeenCalledWith(newTodo.userId);
      expect(dataServices.todo.createTodo).toHaveBeenCalledWith(newTodo);
      expect(result).toEqual(newTodo);
    });
  });

  describe('listTodos', () => {
    it('should throw UserIdIsRequiredException when userId is not provided', async () => {
      await expect(todoUseCases.listTodos(null))
          .rejects.toThrow(UserIdIsRequiredException);
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      const userId = 1;

      jest.spyOn(dataServices.todo, 'checkUserExist').mockResolvedValue(true);

      await expect(todoUseCases.listTodos(userId))
          .rejects.toThrow(UserNotFoundException);
    });

    it('should successfully list todos', async () => {
      const userId = 1;
      const expectedTodos: Todo[] = [
        {
          id: 1,
          title: 'Test Todo 1',
          description: 'Description 1',
          completed: false,
          userId: userId,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Todo 2',
          description: 'Description 2',
          completed: true,
          userId: userId,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(dataServices.todo, 'checkUserExist').mockResolvedValue(false);

      jest.spyOn(dataServices.todo, 'listTodos').mockResolvedValue(expectedTodos);

      const result = await todoUseCases.listTodos(userId);

      expect(dataServices.todo.checkUserExist).toHaveBeenCalledWith(userId);
      expect(dataServices.todo.listTodos).toHaveBeenCalledWith(userId, undefined, undefined);
      expect(result).toEqual(expectedTodos);
    });
  });

  describe('updateTodo', () => {
    it('should successfully update a todo', async () => {
      const todoId = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
        userId: 1,
      };
      const updatedTodo: Todo = {
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
        userId: 1,
        id: todoId,
        createdAt: new Date(),
      };

      jest.spyOn(todoFactoryService, 'updateTodo').mockReturnValue(updatedTodo);

      jest.spyOn(dataServices.todo, 'update').mockResolvedValue(updatedTodo);

      const result = await todoUseCases.updateTodo(todoId.toString(), updateTodoDto);

      expect(todoFactoryService.updateTodo).toHaveBeenCalledWith(updateTodoDto);
      expect(dataServices.todo.update).toHaveBeenCalledWith(todoId, updatedTodo);
      expect(result).toEqual(updatedTodo);
    });
  });

  describe('getAllTodos', () => {
    it('should retrieve all todos', async () => {
      const expectedTodos: Todo[] = [
        {
          id: 1,
          title: 'Todo 1',
          description: 'Description 1',
          completed: false,
          userId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Todo 2',
          description: 'Description 2',
          completed: true,
          userId: 2,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(dataServices.todo, 'getAll').mockResolvedValue(expectedTodos);

      const result = await todoUseCases.getAllTodos();

      expect(dataServices.todo.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedTodos);
    });
  });

  describe('getTodoById', () => {
    it('should retrieve a todo by id', async () => {
      const todoId = 1;
      const expectedTodo: Todo = {
        id: 1,
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
        userId: 1,
        createdAt: new Date(),
      };

      jest.spyOn(dataServices.todo, 'get').mockResolvedValue(expectedTodo);

      const result = await todoUseCases.getTodoById(todoId);

      expect(dataServices.todo.get).toHaveBeenCalledWith(todoId);
      expect(result).toEqual(expectedTodo);
    });
  });
});