import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TodoController } from '../src/app/todo/todo.controller';
import { TodoService } from '../src/app/todo/todo.service';

describe('TodoController', () => {
  let app: INestApplication;
  const todoService = {
    create: jest.fn().mockResolvedValue({ title: 'New Todo' }),
    getList: jest.fn().mockResolvedValue([{ id: 1, title: 'New Todo' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: todoService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a todo', async () => {
    const dto = { title: 'New Todo' };

    await request(app.getHttpServer()).post('/todo').send(dto).expect(201);

    expect(todoService.create).toHaveBeenCalledWith(dto);
  });

  it('should list todos', async () => {
    await request(app.getHttpServer()).get('/todo').expect(200);

    expect(todoService.getList).toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
