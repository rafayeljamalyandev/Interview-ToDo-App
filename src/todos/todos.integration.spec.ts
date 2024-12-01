import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('TodosController (e2e)', () => {
  let app: INestApplication;

  let authToken: string;
  const uniqueEmail = `z.test+${new Date().getTime()}@gmail.com`;
  const password = 'password123';
  let todoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();

    // Register user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: uniqueEmail, password, name: 'Test User' })
      .expect(201);

    // Login to get JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password })
      .expect(200);

    authToken = loginResponse.body.token;

    // Create a todo to use in tests
    const createTodoDto = {
      title: 'Initial Test Todo',
      description: 'Test Description',
    };
    const createTodoResponse = await request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    todoId = createTodoResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new todo', async () => {
    const createTodoDto = {
      title: 'New Test Todo',
      description: 'Another Test Description',
    };

    const response = await request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(createTodoDto.title);
    expect(response.body.description).toBe(createTodoDto.description);
  });

  it('should retrieve all todos with filtering and pagination', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos?limit=5&page=1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should retrieve a specific todo by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', todoId);
    expect(response.body).toHaveProperty('title', 'Initial Test Todo');
  });

  it('should update a todo', async () => {
    const updateTodoDto = {
      title: 'Updated Test Todo',
      description: 'Updated Description',
    };

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .send(updateTodoDto)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('title', updateTodoDto.title);
    expect(response.body).toHaveProperty(
      'description',
      updateTodoDto.description,
    );
  });

  it('should mark a todo as completed', async () => {
    await request(app.getHttpServer())
      .patch(`/todos/${todoId}/completed`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should delete a todo', async () => {
    await request(app.getHttpServer())
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verify deletion
    await request(app.getHttpServer())
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });

  it('should return 404 for a non-existent todo', async () => {
    await request(app.getHttpServer())
      .get('/todos/9999')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });

  it('should return 400 for invalid input during todo creation', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: '' })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.message.toString()).toContain(
      'Title must be at least 3 characters long',
    );
  });
});
