import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import { AuthService } from '../src/auth/auth.service';
import { TodosService } from '../src/todos/todos.service';
import { TODO_CREATE_ERROR } from '../src/todos/todos.constants';

describe('TodosController', () => {
  let app;
  let prisma: PrismaService;
  let userService: UserService;
  let authService: AuthService;
  let todosService: TodosService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    userService = moduleFixture.get(UserService);

    todosService = moduleFixture.get(TodosService);
    authService = moduleFixture.get(AuthService);

    await prisma.user.deleteMany();

    const authDto = { email: 'test@example.com', password: 'password123' };
    const hashedPassword = await userService.hashedPassword(authDto.password);
    await prisma.user.create({
      data: { email: authDto.email, password: hashedPassword },
    });

    const token = await authService.login(authDto);
    accessToken = token.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('when creating a todo', () => {
    it('should return 201 and the created todo when creating a todo', async () => {
      const todoDto = { title: 'Test Todo', completed: false };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(todoDto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.title).toBe(todoDto.title);
      expect(response.body.completed).toBe(todoDto.completed);
    });
  });
  describe('when creating a todo with invalid data', () => {
    it('should throw an error if title is empty', async () => {
      const userId = 1;
      const todoDto = { title: '', completed: false };

      try {
        await todosService.createTodo(userId, todoDto);
      } catch (error) {
        expect(error.response).toBe(TODO_CREATE_ERROR);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });
});
