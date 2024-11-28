import { HttpException } from '@nestjs/common';
import { Request } from 'express';

import { TodoService } from './todo.service';
import { TokenService } from './../../common/token/token.service';
import { TodosService } from './../../services/todos/todos.service';
import { CreateDto } from './dto/create.dto';

describe('TodoService', () => {
  let todoService: TodoService;
  let tokenService: Partial<TokenService>;
  let todosService: Partial<TodosService>;
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    tokenService = {
      extractToken: jest.fn(),
      decode: jest.fn(),
    };

    todosService = {
      createTodo: jest.fn(),
    };

    mockRequest = {
      headers: {
        authorization: 'Bearer fake-token',
      },
    };

    todoService = new TodoService(
      mockRequest as Request,
      tokenService as TokenService,
      todosService as TodosService,
    );
  });

  it('should create a todo successfully', async () => {
    const createDto: CreateDto = { title: 'Test Todo' };
    const decodedToken = { sub: '1' };
    const mockTodo = { title: 'Test Todo', userId: '1' };

    (tokenService.extractToken as jest.Mock).mockReturnValue('fake-token');
    (tokenService.decode as jest.Mock).mockReturnValue(decodedToken);
    (todosService.createTodo as jest.Mock).mockResolvedValue(mockTodo);

    const result = await todoService.create(createDto);

    expect(tokenService.extractToken).toHaveBeenCalledWith(mockRequest);
    expect(tokenService.decode).toHaveBeenCalledWith('fake-token');
    expect(todosService.createTodo).toHaveBeenCalledWith({
      userId: '1',
      title: 'Test Todo',
    });
    expect(result).toEqual(mockTodo);
  });

  it('should throw HttpException if an error occurs', async () => {
    const createDto: CreateDto = { title: 'Test Todo' };

    (tokenService.extractToken as jest.Mock).mockImplementation(() => {
      throw new Error('Token extraction failed');
    });

    await expect(todoService.create(createDto)).rejects.toThrow(HttpException);
    await expect(todoService.create(createDto)).rejects.toThrow(
      'Token extraction failed',
    );
    expect(tokenService.extractToken).toHaveBeenCalledWith(mockRequest);
    expect(tokenService.decode).not.toHaveBeenCalled();
    expect(todosService.createTodo).not.toHaveBeenCalled();
  });
});
