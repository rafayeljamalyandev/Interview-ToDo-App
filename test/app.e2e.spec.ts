import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomValidationPipe } from 'src/shared/middlewares/validation.pipe';
import { AllExceptionFilter } from 'src/shared/middlewares/exception.filter';

describe('End-To-End Tests', () => {
  let app: INestApplication;
  let token: string;
  let testEmail: string = 'test1@mail.com';
  let testPassword: string = '1234567';

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();
    app.useGlobalPipes(
      new CustomValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new AllExceptionFilter());
    await app.init();
  });

  describe('Authentication End-Point', () => {
    it('Register New User successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword })
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('code', 201);
          expect(response.body.data).toHaveProperty('email', testEmail);
        });
    });

    it('400 - Bad Request error when body is not valid', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 400);
        });
    });

    it('409 - Conflict error if email is already used', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword })
        .expect(409)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 409);
        });
    });

    it('Login user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('code', 200);
          expect(response.body.data).toHaveProperty('token');
        });
    });

    it('401 - Authentication Failed when email or password is not correct', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: `${testPassword}x` })
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 401);
        });
    });

    it('400 - Bad Request if body is not valid', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ password: testPassword })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 400);
        });
    });
  });

  describe('Todo End-Point', () => {
    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword });

      token = response.body.data.token;
    });

    it('Create New Todo successfully', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('authorization', `Bearer ${token}`)
        .send({ title: 'Test Todo Title' })
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('code', 201);
          expect(response.body.data).toHaveProperty('title', 'Test Todo Title');
        });
    });

    it('400 - Bad Request error when body is not valid', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('authorization', `Bearer ${token}`)
        .send({ title1: 'Test Todo Title' })
        .expect(400)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 400);
        });
    });

    it('401 - Authentication Failed error when token is not set', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Test Todo Title' })
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 401);
        });
    });

    it('Getting Todo List successfully', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('code', 200);
          expect(response.body.data).toBeInstanceOf(Array);
        });
    });

    it('401 - Authentication Failed error when token is not set', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .expect(401)
        .expect((response) => {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('code', 401);
        });
    });
  });
});
