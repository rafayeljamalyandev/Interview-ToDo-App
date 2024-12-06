import { PrismaService } from '../../../../libs/common/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../../src/auth.module';
import * as argon2 from 'argon2';

if (!process.env.DATABASE_URL.endsWith('test')) {
  console.warn('Tests are only allowed to run on test database.');
  process.exit(0);
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await app.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should register a new user', async () => {
    const registerDto = { email: 'test@example.com', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should log in an existing user', async () => {
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: await argon2.hash('password'),
      },
    });

    const loginDto = { email: 'test@example.com', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should refresh tokens', async () => {
    const registerDto = { email: 'test@example.com', password: '1qaz!QAZ' };
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    const refreshToken = registerResponse.body.refreshToken;

    const refreshDto = { refreshToken };

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${registerResponse.body.accessToken}`)
      .send(refreshDto)
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should return 403 for invalid credentials on login', async () => {
    const loginDto = {
      email: 'nonexistent@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(403);

    expect(response.body).toEqual({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Invalid credentials',
    });
  });

  it('should return 403 for invalid refresh token', async () => {
    const registerDto = { email: 'test@example.com', password: 'password' };
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);

    const invalidRefreshDto = { refreshToken: 'invalidToken' };

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${registerResponse.body.accessToken}`)
      .send(invalidRefreshDto)
      .expect(403);

    expect(response.body).toEqual({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Invalid refresh token',
    });
  });
});
