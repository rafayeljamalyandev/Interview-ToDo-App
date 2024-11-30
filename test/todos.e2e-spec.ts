import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    prisma = app.get<PrismaService>(PrismaService);
    authService = app.get<AuthService>(AuthService);

    await app.init();

    // Create test user and get JWT token
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'password123', // Assuming the password will be hashed by a middleware or hook
        name: 'Test User',
      },
    });

    const { token } = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });

    jwtToken = token;
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  describe('/todos (POST)', () => {
    it('should create a todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          dueDate: new Date().toISOString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Todo');
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
    it('should return todos with pagination', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toBeDefined();
        });
    });

    it('should filter todos by completed status', () => {
      return request(app.getHttpServer())
        .get('/todos?completed=true')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('/todos/stats/summary (GET)', () => {
    it('should return todo statistics', () => {
      return request(app.getHttpServer())
        .get('/todos/stats/summary')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('completed');
          expect(res.body).toHaveProperty('pending');
          expect(res.body).toHaveProperty('completionRate');
        });
    });
  });
}); 