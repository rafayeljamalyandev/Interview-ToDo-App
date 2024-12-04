import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TodoService } from 'src/todo/todos.service';
import { TodoRepository } from 'src/todo/repositories/todo.repository';
import { CreateTodoDto } from 'src/todo/dtos/todo.dto';
import { Todo } from 'src/todo/models/todo.model';
import { UserRepository } from 'src/auth/repositories/user.repository';

describe('Todo Service', () => {
  let todoService: TodoService;
  let todoRepository: TodoRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        PrismaService,
        TodoService,
        { provide: 'ITodoRepository', useClass: TodoRepository },
        { provide: 'IUserRepository', useClass: UserRepository },
      ],
    }).compile();

    todoService = testModule.get<TodoService>(TodoService);
    todoRepository = testModule.get<TodoRepository>('ITodoRepository');
    userRepository = testModule.get<UserRepository>('IUserRepository');
  });

  describe('Create New Todo', () => {
    it('Should Create a New Todo', async () => {
      const todoInfo: CreateTodoDto = {
        title: 'Todo 1',
      };

      jest
        .spyOn(todoRepository, 'createTodo')
        .mockResolvedValue(new Todo(null, 'Todo 1', false, '1'));

      const result = await todoService.createTodo('1', todoInfo);

      expect(todoRepository.createTodo).toHaveBeenCalledWith(
        new Todo(null, 'Todo 1', false, '1'),
      );

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('code', 201);
      expect(result.data).toHaveProperty('title', 'Todo 1');
      expect(result.data).toHaveProperty('userId', '1');
    });

    it('Should return 400 Bad Request error if user is not exists by any reason', async () => {
      const todoInfo: CreateTodoDto = {
        title: 'Todo 2',
      };
      const userId = '1000';

      jest.spyOn(userRepository, 'getUserById').mockResolvedValue(null);

      const result = await todoService.createTodo(userId, todoInfo);

      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('code', 400);
      expect(result).toHaveProperty('data', null);
    });
  });

  describe('Get Todo List', () => {
    it('Should get Todo list', async () => {
      const userId = '1';

      jest
        .spyOn(todoRepository, 'getTodoList')
        .mockResolvedValue([new Todo(null, 'Todo 1', false, '1')]);

      const result = await todoService.getUserTodoList(userId);

      expect(todoRepository.getTodoList).toHaveBeenCalledWith(userId);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toBeInstanceOf(Array);
      expect(
        (result.data as Array<Todo>).every((todo) => todo instanceof Todo),
      ).toBeTruthy();
    });
  });
});
