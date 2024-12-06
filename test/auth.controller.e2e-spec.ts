import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../src/user/user.service';
import {
  INVALID_EMAIL,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MUST_BE_STRING,
} from '../src/auth/auth.constants';

describe('AuthController', () => {
  let app;
  let prisma: PrismaService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    userService = moduleFixture.get(UserService);

    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('when valid credentials are provided', () => {
    it('should return 200 and access token', async () => {
      const authDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await userService.hashedPassword(authDto.password);
      await prisma.user.create({
        data: { email: authDto.email, password: hashedPassword },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto);

      expect(response.body).toHaveProperty('accessToken');
    });
  });

  describe('when email is not provided or invalid', () => {
    it('should return 400 Bad Request if email is missing', async () => {
      const authDto = { password: 'password123' };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain(INVALID_EMAIL);
    });
  });

  describe('when password is missing or incorrect', () => {
    it('should return 400 Bad Request if password is missing', async () => {
      const authDto = { email: 'test@example.com' };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain(PASSWORD_MIN_LENGTH);
      expect(response.body.message).toEqual([
        PASSWORD_MIN_LENGTH,
        PASSWORD_MUST_BE_STRING,
      ]);
    });
  });
});
