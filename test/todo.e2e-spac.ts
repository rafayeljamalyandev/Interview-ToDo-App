import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/app.module';

describe('TodosController (e2e)', () => {
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
  
    it('should create a todo', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('test123', 10),
        },
      });
  
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'test123' })
        .expect(200);
  
      const token = loginResponse.body.access_token;
  
      const createTodoResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Todo' })
        .expect(201);
  
      expect(createTodoResponse.body).toHaveProperty('id');
      expect(createTodoResponse.body.title).toBe('New Todo');
  
      await prismaService.user.delete({ where: { id: user.id } });
    });
  
    it('should list todos', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('test123', 10),
        },
      });
  
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'test123' })
        .expect(200);
  
      const token = loginResponse.body.access_token;
  
      await prismaService.todo.create({
        data: { title: 'Test Todo', userId: user.id },
      });
  
      const response = await request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
  
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0].title).toBe('Test Todo');
  
      await prismaService.user.delete({ where: { id: user.id } });
    });
  
    afterEach(async () => {
      await prismaService.user.deleteMany();
      await prismaService.todo.deleteMany(); // Clean up the test database
    });
  });
  