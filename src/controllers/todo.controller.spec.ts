/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import {
  CanActivate,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../modules/prisma/prisma.service';
import { TodoService } from '../modules/todo/todos.service';
import { TodosController } from '../controllers/todos.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../libs/jwt/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

describe('TodosController', () => {
  let app: INestApplication;
  let todoService: TodoService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockGuard: CanActivate = {
      canActivate: jest.fn((context) => {
        // Mock the behavior of JwtAuthGuard
        const request = context.switchToHttp().getRequest();
        request.user = { sub: 1 }; // Mock user ID as 1
        return true; // Allow the request to proceed
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule], // Import the module where ConfigService is defined
      controllers: [TodosController],
      providers: [TodoService, PrismaService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .compile();

    app = module.createNestApplication();
    todoService = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('POST /todos/create', () => {
    it('should create a new todo', async () => {
      const createTodoDto = { title: 'Test Todo' };
      const userId = 1;

      jest.spyOn(todoService, 'createTodo').mockResolvedValue({
        status: 201,
        message: 'TODO created successfully.',
        data: { id: 1, title: 'Test Todo', completed: false, userId },
      });

      const response = await request(app.getHttpServer())
        .post('/todos/create')
        .send(createTodoDto)
        .set('Authorization', `Bearer valid_token`) // Using a mock token
        .expect(201);

      expect(response.body.message).toBe('TODO created successfully.');
      expect(response.body.data.title).toBe(createTodoDto.title);
    });
  });

  describe('GET /todos/all', () => {
    it('should return a list of todos', async () => {
      const userId = 1;

      jest.spyOn(todoService, 'listTodos').mockResolvedValue({
        status: 200,
        message: 'Todos fetched successfully.',
        data: [{ id: 1, title: 'Test Todo', completed: false, userId }],
      });

      const response = await request(app.getHttpServer())
        .get('/todos/all')
        .set('Authorization', `Bearer valid_token`)
        .expect(200);

      expect(response.body.message).toBe('Todos fetched successfully.');
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /todos/:id/update', () => {
    it('should update a todo', async () => {
      const userId = 1;
      const updateTodoDto = { title: 'Updated Todo' };
      const todoId = 1;

      jest.spyOn(todoService, 'updateTodo').mockResolvedValue({
        status: 200,
        message: 'TODO updated successfully.',
        data: { id: todoId, title: 'Updated Todo', completed: false, userId },
      });

      const response = await request(app.getHttpServer())
        .patch(`/todos/${todoId}/update`)
        .send(updateTodoDto)
        .set('Authorization', `Bearer valid_token`)
        .expect(200);

      expect(response.body.message).toBe('TODO updated successfully.');
      expect(response.body.data.title).toBe(updateTodoDto.title);
    });

    it('should return a 404 if todo not found', async () => {
      const userId = 1;
      const updateTodoDto = { title: 'Updated Todo' };
      const todoId = 1;

      jest
        .spyOn(todoService, 'updateTodo')
        .mockRejectedValue(new NotFoundException('Todo not found'));

      const response = await request(app.getHttpServer())
        .patch(`/todos/${todoId}/update`)
        .send(updateTodoDto)
        .set('Authorization', `Bearer valid_token`)
        .expect(404);

      expect(response.body.message).toBe('Todo not found');
    });
  });

  describe('DELETE /todos/:id/delete', () => {
    it('should delete a todo', async () => {
      const userId = 1;
      const todoId = 1;

      jest.spyOn(todoService, 'deleteTodo').mockResolvedValue({
        status: 200,
        message: 'TODO deleted successfully.',
      });

      const response = await request(app.getHttpServer())
        .delete(`/todos/${todoId}/delete`)
        .set('Authorization', `Bearer valid_token`)
        .expect(200 | 204);

      if (response.statusCode === 200) {
        expect(response.body.message).toBe('TODO deleted successfully.');
      }
    });

    it('should return 404 if todo not found', async () => {
      const userId = 1;
      const todoId = 1;

      jest
        .spyOn(todoService, 'deleteTodo')
        .mockRejectedValue(new NotFoundException('Todo not found'));

      const response = await request(app.getHttpServer())
        .delete(`/todos/${todoId}/delete`)
        .set('Authorization', `Bearer valid_token`)
        .expect(404);

      expect(response.body.message).toBe('Todo not found');
    });
  });

  describe('GET /todos/:id/details', () => {
    it('should return a todo by id', async () => {
      const userId = 1;
      const todoId = 1;

      jest.spyOn(todoService, 'getTodoById').mockResolvedValue({
        status: 200,
        message: 'Todo fetched successfully.',
        data: { id: todoId, title: 'Test Todo', completed: false, userId },
      });

      const response = await request(app.getHttpServer())
        .get(`/todos/${todoId}/details`)
        .set('Authorization', `Bearer valid_token`)
        .expect(200);

      expect(response.body.message).toBe('Todo fetched successfully.');
      expect(response.body.data.id).toBe(todoId);
    });

    it('should return 404 if todo not found', async () => {
      const userId = 1;
      const todoId = 1;

      jest
        .spyOn(todoService, 'getTodoById')
        .mockRejectedValue(new NotFoundException('Todo not found'));

      const response = await request(app.getHttpServer())
        .get(`/todos/${todoId}/details`)
        .set('Authorization', `Bearer valid_token`)
        .expect(404);

      expect(response.body.message).toBe('Todo not found');
    });
  });
});
