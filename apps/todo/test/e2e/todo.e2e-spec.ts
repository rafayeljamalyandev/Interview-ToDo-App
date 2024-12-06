import { PrismaService } from '../../../../libs/common/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoModule } from '../../src/todo.module';
import { hash } from 'argon2';

if (!process.env.DATABASE_URL.endsWith('test')) {
  console.warn('Tests are only allowed to run on test database.');
  process.exit(0);
}

describe('User  Registration and TodoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const userEmail = 'testuser@example.com';
  const userPassword = 'StrongPassword1!';

  const createUser = async (email: string, password: string) => {
    const hashedPassword = await hash(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);
    return response.body.accessToken;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    await prisma.user.deleteMany();

    token = await createUser(userEmail, userPassword);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('todo (POST)', () => {
    it('should create a todo', async () => {
      const createTodoDto = { title: 'Test Todo' };

      const response = await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', `Bearer ${token}`)
        .send(createTodoDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toEqual(createTodoDto.title);
    });
  });

  describe('todo (GET)', () => {
    it('should return a list of todos', async () => {
      const createTodoDto = { title: 'Test Todo' };
      await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', `Bearer ${token}`)
        .send(createTodoDto);

      const response = await request(app.getHttpServer())
        .get('/todo')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty(
        'title',
        createTodoDto.title,
      );
    });
  });
});
