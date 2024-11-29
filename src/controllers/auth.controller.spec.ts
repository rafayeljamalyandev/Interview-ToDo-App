/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/auth/user.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Load configuration
        PrismaModule,
        JwtModule.register({
          secret: 'mockSecret', // Provide a mock secret key
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService, UserService],
      controllers: [AuthController],
    })
      .overrideProvider(JwtService)
      .useValue({
        signAsync: jest.fn().mockResolvedValue('mockJwtToken'), // Mock the signAsync method
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('/auth/register (POST) - success', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: `test${Date.now()}@test.com`, password: 'Test123$' })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe(200);
          expect(res.body.message).toBe('User created successfully');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toMatch(/test\d+@test\.com/);
        });
    });

    it('/auth/register (POST) - Email already in use', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: 'Test123$' })
        .expect((res) => {
          expect(res.body.statusCode).toBe(409);
          expect(res.body.message).toBe('Email already in use');
        });
    });
  });

  describe('POST /auth/login', () => {
    it('/auth/login (POST) - success', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@test.com', password: 'Test123$' })
        .expect((res) => {
          expect(res.body.status).toBe(200);
          expect(res.body.message).toBe('Login successful');
          expect(res.body.data).toBe('mockJwtToken');
        });
    });

    it('/auth/login (POST) - Invalid Credential', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'tesst@test.com', password: 'Test1234$' })
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.message).toBe('Invalid credentials');
        });
    });
  });
});
