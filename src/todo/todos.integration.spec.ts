import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../common/guards/jwtAuthGuard';
import { RESPONSE_MESSAGES } from '../common/constants/responseMessages.constant';

describe('TodosController (Integration)', () => {
  let app: INestApplication;
  let todosService: Partial<TodosService>;

  beforeAll(async () => {
    todosService = {
      createTodo: jest.fn((dto, userId) =>
        Promise.resolve({ id: 1, ...dto, userId, completed: false }),
      ),
      listUserTodos: jest.fn((userId) =>
        Promise.resolve([
          { id: 1, title: 'Sample Todo', userId, completed: false },
        ]),
      ),
      updateTodo: jest.fn((id, userId, dto) =>
        Promise.resolve({
          id,
          ...dto,
          userId,
          completed: dto.completed ?? false,
        }),
      ),
      deleteTodo: jest.fn(() => Promise.resolve(RESPONSE_MESSAGES.DELETED)),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: todosService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1 }; // Mock user
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST todos - should create a todo', async () => {
    const createTodoDto = { title: 'Test Todo' };
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      title: 'Test Todo',
      completed: false,
      userId: 1,
    });
    expect(todosService.createTodo).toHaveBeenCalledWith(createTodoDto, 1);
  });

  it('/PUT todos/:id - should update a todo', async () => {
    const updateTodoDto = { title: 'Updated Todo', completed: true };
    const response = await request(app.getHttpServer())
      .put('/todos/1')
      .send(updateTodoDto)
      .expect(200);

    expect(response.body).toEqual({
      id: '1',
      title: 'Updated Todo',
      completed: true,
      userId: 1,
    });
    expect(todosService.updateTodo).toHaveBeenCalledWith('1', 1, updateTodoDto);
  });

  it('/DELETE todos/:id - should delete a todo', async () => {
    const response = await request(app.getHttpServer())
      .delete('/todos/1')
      .expect(200);

    expect(response.text).toBe('Deleted successfully');
    expect(todosService.deleteTodo).toHaveBeenCalledWith('1', 1);
  });

  it('/GET todos - should list all todos for the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: 1,
        title: 'Sample Todo',
        completed: false,
        userId: 1,
      },
    ]);
    expect(todosService.listUserTodos).toHaveBeenCalledWith(1);
  });
});
