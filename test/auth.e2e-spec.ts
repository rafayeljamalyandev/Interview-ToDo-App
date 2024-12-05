import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/modules/app.module';
import { PrismaService } from 'src/services/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('should register a new user', async () => {
    const newUser = { email: 'test@example.com', password: 'test123' };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(newUser.email);
  });

  it('should login an existing user and return a token', async () => {
    const loginUser = { email: 'test@example.com', password: 'test123' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUser)
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });

  it('should not login with invalid credentials', async () => {
    const invalidLogin = { email: 'test@example.com', password: 'wrongpassword' };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(invalidLogin)
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  afterEach(async () => {
    await prismaService.user.deleteMany(); // Clean up the test database
  });
});
