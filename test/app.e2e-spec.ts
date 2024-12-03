require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});

import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let app: INestApplication;
let token: string;

const generateUserCredentials = () => ({
  email: faker.internet.email({ allowSpecialCharacters: true}),
  password: faker.internet.password({
    length: 12,
    memorable: true,
    pattern: /[a-zA-Z0-9]+$/,
    prefix: 'user_1!',
  }),
});

const registerUser = async (userCredentials: { email: string; password: string }) => {
  const response = await request(app.getHttpServer())
    .post('/auth/register')
    .send(userCredentials)
    .expect(201);
  return response.body.data;
};

const loginUser = async (userCredentials: { email: string; password: string }) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(userCredentials)
    .expect(200);
  return response.body.token;
};

describe('End-to-End Tests for APIs', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.todo.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  describe('General API Tests', () => {
    it('GET / - should return "Hello World!"', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);
      expect(response.text).toEqual('Hello World!');
    });
  });

  describe('Authentication Tests', () => {
    it('POST /auth/register - should register a new user', async () => {
      const userCredentials = generateUserCredentials();
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userCredentials)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.data).toMatchObject({ email: userCredentials.email });
    });

    it('POST /auth/register - should return 400 if email is already in use', async () => {
      const userCredentials = generateUserCredentials();
      await registerUser(userCredentials);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userCredentials)
        .expect(400);

      expect(response.body.message).toBe('Email already in use');
    });

    it('POST /auth/login - should log in a user and return a token', async () => {
      const userCredentials = generateUserCredentials();
      await registerUser(userCredentials);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userCredentials)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      token = response.body.token;
    });

    it('POST /auth/login - should return 401 for invalid credentials', async () => {
      const userCredentials = generateUserCredentials();

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userCredentials)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('Todo Tests', () => {
    it('POST /todos - should create a new todo with a valid token', async () => {
      const newTodo = { title: 'Test Todo', description: 'Sample description' };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send(newTodo)
        .expect(201);

      expect(response.body).toHaveProperty('title', newTodo.title);
      expect(response.body).toHaveProperty('completed', false);
    });

    it('POST /todos - should return 401 when no token is provided', async () => {
      const newTodo = { title: 'Unauthorized Todo', description: 'No token provided' };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(newTodo)
        .expect(401);

      expect(response.body.message).toBe('Authorization header is missing');
    });

    it('GET /todos - should list all todos for the authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('title');
      }
    });
  });
});
