// todos.e2e.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import { PrismaClient } from '@prisma/client';

describe('Todos API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await app.close();
  });

  // Test for creating a Todo
  describe('POST /todos', () => {
    it('should create a new todo and return a success response', async () => {
      const newTodo = { title: 'Test Todo', userId: 1 };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(newTodo)
        .expect(201);

      expect(response.body).toEqual({
        message: 'Todo created successfully',
        todo: expect.objectContaining({
          id: expect.any(Number),
          title: newTodo.title,
          userId: newTodo.userId,
        }),
      });
    });

    it('should return 409 if user is not found', async () => {
      const newTodo = { title: 'Test Todo', userId: 999 };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(newTodo)
        .expect(409);

      expect(response.body).toEqual({
        statusCode: 409,
        message: 'User not found',
      });
    });
  });

  // Test for listing Todos for a user
  describe('GET /todos', () => {
    it('should fetch todos for a user', async () => {
      const createdTodo = await prisma.todo.create({
        data: { title: 'Test Todo', userId: 1 },
      });

      const response = await request(app.getHttpServer())
        .get(`/todos`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Todos fetched successfully',
        data: {
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: createdTodo.id,
              title: createdTodo.title,
              userId: createdTodo.userId,
            }),
          ]),
        },
      });
    });

    it('should return 404 if no todos are found for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: 'No todos found for this user',
      });
    });
  });
});
