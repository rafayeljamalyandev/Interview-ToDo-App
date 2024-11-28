import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

describe('Todos (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);

    // Configure app same as in main.ts
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());

    await app.init();

    // Create test user and get auth token
    await request(app.getHttpServer()).post('/users').send({
      email: 'test@example.com',
      password: 'StrongP@ssw0rd123',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'StrongP@ssw0rd123',
      });

    const setCookieHeader = loginResponse.headers['set-cookie'][0];
    authToken = setCookieHeader.split(';')[0];
  });

  afterAll(async () => {
    await prismaService.todo.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('/todos (POST)', () => {
    it('should create a todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Cookie', authToken)
        .send({
          title: 'Test Todo',
          completed: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Todo');
          expect(res.body.completed).toBe(false);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
        })
        .expect(401);
    });
  });

  describe('/todos (GET)', () => {
    it('should return user todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Cookie', authToken)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body[0]).toHaveProperty('title');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer()).get('/todos').expect(401);
    });
  });
});
