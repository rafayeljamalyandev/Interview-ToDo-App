import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import {
  EMAIL_INVALID,
  PASSWORD_MIN_LENGTH_ERRORS,
  REGISTRATION_ERROR,
} from '../src/user/user.constants';

describe('UserController', () => {
  let app;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('When valid email and password', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createUserDto.email);
    });
  });

  describe('When email is already taken', () => {
    it('should throw a forbidden error', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto);

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.message).toBe(REGISTRATION_ERROR);
    });
  });

  describe('When email is invalid', () => {
    it('should throw a bad request error', async () => {
      const createUserDto = {
        email: 'invalidemail',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain(EMAIL_INVALID);
    });
  });

  describe('When password is missing', () => {
    it('should throw a bad request error', async () => {
      const createUserDto = {
        email: 'newuser@example.com',
        password: '',
      };

      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(createUserDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain(PASSWORD_MIN_LENGTH_ERRORS);
    });
  });
});
