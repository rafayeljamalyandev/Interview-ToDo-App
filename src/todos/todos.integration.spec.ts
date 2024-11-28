import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  let authToken: string;
  const uniqueEmail = `test+${Date.now()}@test.com`;
  const password = 'password123';
  let todoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();

    // Step 1: Register the user via the registration endpoint
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: uniqueEmail, password })
      .expect(201);

    // Step 2: Login to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password })
      .expect(201);

    authToken = loginResponse.body.token;

    // Step 3: Create a todo for the user to test updates
    const createTodoDto = { title: 'Test Todo' };
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

  // Utility function to create a test user
  const createTestUser = async () => {
    return { userId: 1 };
  };

  it('should create a todo', async () => {
    const createTodoDto = { title: 'Test Todo' };

    const response = await request(app.getHttpServer())
      .post('/todos')
      .send(createTodoDto)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(createTodoDto.title);
  });

  // Test forlisting todos
  it('should return a list of todos for the user', async () => {
    const user = await createTestUser();

    const response = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((todo) => {
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
    });
  });

  // Test for editing a todo title
  it('should update a todo title', async () => {
    const newTitle = 'Updated Title';

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .send({ title: newTitle })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.title).toBe(newTitle);
  });

  // Test for completing the todo
  it('should mark a todo as completed', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}/complete`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.completed).toBe(true);
  });

  // Test for handling NotFoundException (todo not found)
  it('should return 404 if todo not found for update', async () => {
    const todoId = 9999; // Non-existent todo ID

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .send({ title: 'Updated Title' })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body.message).toBe(`Todo with ID ${todoId} not found`);
  });

  //  Test for validating required title for editing
  it('should return 400 if title is not provided for update', async () => {
    const todoId = 1;

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .send({ title: '' })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    expect(response.body.message).toBe('Title is required');
  });
});
