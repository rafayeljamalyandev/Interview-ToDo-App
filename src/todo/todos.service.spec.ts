import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UpdateTodoDto } from './dtos/updateTodo.dto';
import { UsersService } from '../users/users.service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ITodo } from '../common/interfaces/todo.interface';
import { IUser } from '../common/interfaces/user.interface';
import { RESPONSE_MESSAGES } from '../common/constants/responseMessages.constant';

describe('TodosService', () => {
  let service: TodosService;
  let prismaService: PrismaService;
  let usersService: UsersService;

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
              update: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a todo', async () => {
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
    };
    const userId = 1;
    const user: IUser = {
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@email.com',
      password: 'Password123',
    };

    jest.spyOn(usersService, 'findById').mockResolvedValue(user);
    jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prismaService.todo, 'create').mockResolvedValue({
      id: 1,
      title: createTodoDto.title,
      completed: false,
      userId,
    });

    const todo = await service.createTodo(createTodoDto, userId);

    expect(todo).toEqual({
      id: 1,
      title: createTodoDto.title,
      completed: false,
      userId,
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
    };
    const userId = 1;

    jest.spyOn(usersService, 'findById').mockResolvedValue(null);

    await expect(service.createTodo(createTodoDto, userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if todo already exists', async () => {
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
    };
    const userId = 1;
    const existingTodo: ITodo = {
      id: 1,
      title: createTodoDto.title,
      completed: false,
      userId,
    };

    jest.spyOn(usersService, 'findById').mockResolvedValue({
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@email.com',
      password: 'Password123',
    });
    jest.spyOn(prismaService.todo, 'findFirst').mockResolvedValue(existingTodo);

    await expect(service.createTodo(createTodoDto, userId)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should list all todos for a user', async () => {
    const userId = 1;
    const todos: ITodo[] = [
      {
        id: 1,
        title: 'Test Todo',
        completed: false,
        userId,
      },
    ];

    jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue(todos);

    const result = await service.listUserTodos(userId);

    expect(result).toEqual(todos);
  });

  it('should throw NotFoundException if no todos are found for user', async () => {
    const userId = 4;

    jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);

    await expect(service.listUserTodos(userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a todo', async () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      completed: true,
    };
    const userId = 1;
    const todoId = 1;

    jest.spyOn(prismaService.todo, 'update').mockResolvedValue({
      id: todoId,
      title: updateTodoDto.title,
      completed: false,
      userId,
    });

    const result = await service.updateTodo(userId, todoId, updateTodoDto);

    expect(result.title).toBe(updateTodoDto.title);
  });

  it('should throw NotFoundException if todo to update is not found', async () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      completed: true,
    };
    const userId = 1;
    const todoId = 1;

    jest
      .spyOn(prismaService.todo, 'update')
      .mockRejectedValue({ code: 'P2025' }); // Prisma error code for not found

    await expect(
      service.updateTodo(userId, todoId, updateTodoDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if todo id is invalid', async () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      completed: true,
    };

    await expect(service.updateTodo(NaN, 1, updateTodoDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should delete a todo', async () => {
    const userId = 1;
    const todoId = 1;

    jest.spyOn(prismaService.todo, 'delete').mockResolvedValue({
      id: todoId,
      title: 'Test Todo',
      completed: false,
      userId,
    });

    const result = await service.deleteTodo(userId, todoId);

    expect(result).toBe(RESPONSE_MESSAGES.DELETED);
  });

  it('should throw NotFoundException if todo to delete is not found', async () => {
    const userId = 1;
    const todoId = 1;

    jest
      .spyOn(prismaService.todo, 'delete')
      .mockRejectedValue({ code: 'P2025' }); // Prisma error code for not found

    await expect(service.deleteTodo(userId, todoId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if todo id is invalid', async () => {
    await expect(service.deleteTodo(NaN, 1)).rejects.toThrow(
      BadRequestException,
    );
  });
});
