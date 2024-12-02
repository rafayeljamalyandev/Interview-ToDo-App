import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../../src/todos/todos.controller';
import { TodoService } from '../../src/todos/todos.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth-guard';
import { HttpException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodoService = {
    create: jest.fn(),
    getTodosByUser: jest.fn(),
    getTodoById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    searchTodos: jest.fn(),
  };

  const mockUser = { id: 1 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTodo', () => {
    it('should create a todo successfully', async () => {
      const createDto = { title: 'Test Todo', description: 'Test Description' };
      const result = { id: 1, ...createDto, userId: mockUser.id };
      mockTodoService.create.mockResolvedValue(result);

      const response = await controller.createTodo(createDto, { user: mockUser });
      expect(response).toEqual({ message: 'Todo created successfully', data: result });
      expect(mockTodoService.create).toHaveBeenCalledWith(createDto, mockUser.id);
    });

    it('should throw an error if service fails', async () => {
      const createDto = { title: 'Test Todo', description: 'Test Description' };
      mockTodoService.create.mockRejectedValue(new Error('Service Error'));

      await expect(controller.createTodo(createDto, { user: mockUser })).rejects.toThrow('Service Error');
    });
  });

  describe('getTodosByUser', () => {
    it('should fetch todos for a user', async () => {
      const result = [{ id: 1, title: 'Test Todo', userId: mockUser.id }];
      mockTodoService.getTodosByUser.mockResolvedValue(result);

      const response = await controller.getTodosByUser({ user: mockUser });
      expect(response).toEqual({ message: 'Todos fetched successfully', data: result });
      expect(mockTodoService.getTodosByUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getTodoById', () => {
    it('should fetch a todo by id', async () => {
      const id = 1;
      const result = { id, title: 'Test Todo', userId: mockUser.id };
      mockTodoService.getTodoById.mockResolvedValue(result);

      const response = await controller.getTodoById(id, { user: mockUser });
      expect(response).toEqual({ message: 'Todo fetched successfully', data: result });
      expect(mockTodoService.getTodoById).toHaveBeenCalledWith(id, mockUser.id);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const id = 1;
      const updateDto = { title: 'Updated Todo' };
      const result = { id, ...updateDto, userId: mockUser.id };
      mockTodoService.updateTodo.mockResolvedValue(result);

      const response = await controller.updateTodo(id, updateDto, { user: mockUser });
      expect(response).toEqual({ message: 'Todo updated successfully', data: result });
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(id, updateDto, mockUser.id);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const id = 1;
      mockTodoService.deleteTodo.mockResolvedValue(true);

      const response = await controller.deleteTodo(id, { user: mockUser });
      expect(response).toEqual({ message: 'Todo deleted successfully' });
      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(id, mockUser.id);
    });
  });

  describe('searchTodos', () => {
    it('should return todos matching a query', async () => {
      const query = 'Test';
      const result = [{ id: 1, title: 'Test Todo', userId: mockUser.id }];
      mockTodoService.searchTodos.mockResolvedValue(result);

      const response = await controller.searchTodos({ user: mockUser }, query);
      expect(response).toEqual({ message: 'Todos retrieved successfully', data: result });
      expect(mockTodoService.searchTodos).toHaveBeenCalledWith(mockUser.id, query);
    });

    it('should return an empty array if no todos match the query', async () => {
      const query = 'Nonexistent';
      mockTodoService.searchTodos.mockResolvedValue([]);

      const response = await controller.searchTodos({ user: mockUser }, query);
      expect(response).toEqual({ message: 'No todos found matching your query.', data: [] });
    });

    it('should throw an error if query is missing', async () => {
      await expect(controller.searchTodos({ user: mockUser }, '')).rejects.toThrow(HttpException);
    });

    describe('TodoController Error Handling', () => {
      describe('getTodosByUser (error handling)', () => {
        it('should handle errors when fetching todos', async () => {
          mockTodoService.getTodosByUser.mockRejectedValue(new Error('Failed to fetch todos'));
          await expect(controller.getTodosByUser({ user: mockUser })).rejects.toThrow('Failed to fetch todos');
        });
      });
    
      describe('getTodoById (error handling)', () => {
        it('should handle errors when fetching a todo by id', async () => {
          const id = 1;
          mockTodoService.getTodoById.mockRejectedValue(new Error('Todo not found'));
          await expect(controller.getTodoById(id, { user: mockUser })).rejects.toThrow('Todo not found');
        });
      });
    
      describe('updateTodo (error handling)', () => {
        it('should handle errors when updating a todo', async () => {
          const id = 1;
          const updateDto = { title: 'Updated Todo' };
          mockTodoService.updateTodo.mockRejectedValue(new Error('Failed to update todo'));
          await expect(controller.updateTodo(id, updateDto, { user: mockUser })).rejects.toThrow('Failed to update todo');
        });
      });
    
      describe('deleteTodo (error handling)', () => {
        it('should handle errors when deleting a todo', async () => {
          const id = 1;
          mockTodoService.deleteTodo.mockRejectedValue(new Error('Failed to delete todo'));
          await expect(controller.deleteTodo(id, { user: mockUser })).rejects.toThrow('Failed to delete todo');
        });
      });
    
      describe('searchTodos (error handling)', () => {
        it('should handle errors during search', async () => {
          const query = 'Test';
          mockTodoService.searchTodos.mockRejectedValue(new Error('Search failed'));
          await expect(controller.searchTodos({ user: mockUser }, query)).rejects.toThrow('Search failed');
        });
      });
    });
    
  });
});


