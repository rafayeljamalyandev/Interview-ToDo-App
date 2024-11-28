import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TodosService', () => {
  let todosService: TodosService;
  let prismaService: PrismaService;

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
            },
          },
        },
      ],
    }).compile();

    todosService = module.get<TodosService>(TodosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createTodo', () => {
    it('should create a todo for the given user', async () => {
      const userId = 1;
      const title = 'Test Todo';
      const createdTodo = { id: 1, userId, title };
      (jest.spyOn(prismaService.todo, 'create') as jest.Mock).mockResolvedValue(
        createdTodo,
      );

      const result = await todosService.createTodo(userId, title);

      expect(prismaService.todo.create).toHaveBeenCalledWith({
        data: { title, userId },
      });
      expect(result).toEqual(createdTodo);
    });
  });

  describe('listTodos', () => {
    it('should return a list of todos for the given user', async () => {
      const userId = 1;
      const todos = [
        { id: 1, userId, title: 'Test Todo 1' },
        { id: 2, userId, title: 'Test Todo 2' },
      ];
      (
        jest.spyOn(prismaService.todo, 'findMany') as jest.Mock
      ).mockResolvedValue(todos);

      const result = await todosService.listTodos(userId);

      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(todos);
    });

    it('should return an empty list if no todos exist for the user', async () => {
      const userId = 1;
      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([]);

      const result = await todosService.listTodos(userId);

      expect(prismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual([]);
    });
  });
});
