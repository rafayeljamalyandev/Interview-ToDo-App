import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await prisma.$connect();
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    const userResponse = await request(app.getHttpServer())
      .post('/user/register')
      .send({ email: 'user@example.com', password: 'password123' });

    authToken = userResponse.body.token;
  });

  describe('UserService', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(201);

      expect(response.body.user).toMatchObject({ email: 'test@example.com' });
      expect(response.body.token).toBeDefined();
    });

    it('should not register a user with an existing email', async () => {
      await prisma.user.create({
        data: { email: 'test@example.com', password: await bcrypt.hash('password123', 10) },
      });

      await request(app.getHttpServer())
        .post('/user/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(409);
    });

    it('should log in an existing user', async () => {
      const password = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: { email: 'test@example.com', password },
      });

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(201);

      expect(response.body.user).toMatchObject({ email: 'test@example.com' });
      expect(response.body.token).toBeDefined();
    });
  });

  describe('TodosService', () => {
    it('should create a new to-do item', async () => {
      const response = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Todo' })
        .expect(201);

      expect(response.body).toMatchObject({ title: 'Test Todo' });
    });
  })
});