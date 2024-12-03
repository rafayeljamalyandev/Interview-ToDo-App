import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {PrismaService} from "../src/frameworks/data-services/mysql/prisma.service";
import {AppModule} from "../src/app.module";

describe('UserUseCases (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // await prismaService.user.deleteMany({});
    // await app.close();
  });

  beforeEach(async () => {
    // await prismaService.user.deleteMany({});
  });

  describe('User Registration and Login Flow', () => {
    it('should successfully register a new user and then login', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'strongPassword123!'
      };


      const registrationResponse = await request(app.getHttpServer())
          .post('/users/register')
          .send(registerDto)
          .expect(201);


      expect(registrationResponse.body).toHaveProperty('id');
      expect(registrationResponse.body.email).toBe(registerDto.email);


      const loginResponse = await request(app.getHttpServer())
          .post('/users/login')
          .send({
            email: registerDto.email,
            password: registerDto.password
          })
          .expect(200);


      expect(loginResponse.body).toHaveProperty('token');


      const decodedToken = jwt.verify(
          loginResponse.body.token,
          process.env.JWT_SECRET || 'defaultSecret'
      );

      expect(decodedToken).toHaveProperty('data');
      // expect(decodedToken.data).toHaveProperty('email', registerDto.email);
    });

    it('should fail to login with incorrect password', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'strongPassword123!'
      };

      await request(app.getHttpServer())
          .post('/users/register')
          .send(registerDto)
          .expect(201);

      await request(app.getHttpServer())
          .post('/users/login')
          .send({
            email: registerDto.email,
            password: 'incorrectPassword'
          })
          .expect(404);
    });

    it('should fail to login with non-existent user', async () => {
      await request(app.getHttpServer())
          .post('/users/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'somePassword'
          })
          .expect(404);
    });

    it('should prevent duplicate user registration', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'strongPassword123!'
      };

      await request(app.getHttpServer())
          .post('/users/register')
          .send(registerDto)
          .expect(201);

      await request(app.getHttpServer())
          .post('/users/register')
          .send(registerDto)
          .expect(409);
    });

    it('should validate email format during registration', async () => {
      await request(app.getHttpServer())
          .post('/users/register')
          .send({
            email: 'invalidEmail',
            password: 'strongPassword123!'
          })
          .expect(400);
    });

    it('should validate password strength during registration', async () => {
      await request(app.getHttpServer())
          .post('/users/register')
          .send({
            email: 'test@example.com',
            password: 'weak'
          })
          .expect(400);
    });
  });
});