import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const generateRandomEmail = () => {
  const timestamp = Date.now();
  return `testuser${timestamp}@example.com`;
};

let randomEmail = generateRandomEmail();

describe('Auth and Todo Controller (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let todoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  /**
   * Todo Authentication
   */

  describe('AuthController', () => {
    it('POST /auth/register - should register a user', async () => {
      const registerDto = {
        email: randomEmail,  //register your test email
        password: 'TestPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'User registered successfully',
          user: expect.any(Object),
        }),
      );
    });

    it('POST /auth/login - should login a user and return a token', async () => {
      const loginDto = {
        email: randomEmail,// login with the test email
        password: 'TestPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      jwtToken = response.body.accessToken;

      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });


    /**
     * Todo test need to login first
     */

    it('POST /auth/login - should fail to login with incorrect credentials', async () => {
      const loginDto = {
        email: randomEmail, //replace with new email created above to match to todoo search case for current user
        password: 'WrongPassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('TodoController', () => {
    it('POST /todos/create - should create a todo', async () => {
      const createTodoDto = {
        title: 'Test Todo',
        completed: false,
      };

      const response = await request(app.getHttpServer())
        .post('/todos/create')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createTodoDto)
        .expect(201);

      todoId = response.body.data.id;

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todo created successfully',
          data: expect.any(Object),
        }),
      );
    });

    it('GET /todos/list - should fetch all todos for the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos/list')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todos fetched successfully',
          data: expect.any(Array),
        }),
      );
    });

    it('GET /todos/find/:id - should fetch a specific todo by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/todos/find/${todoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todo fetched successfully',
          data: expect.any(Object),
        }),
      );
    });

    it('PUT /todos/update/:id - should update a specific todo', async () => {
      const updateTodoDto = {
        title: 'test update Todo',//create a todo
      };

      const response = await request(app.getHttpServer())
        .put(`/todos/update/${todoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateTodoDto)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todo updated successfully',
          data: expect.any(Object),
        }),
      );
    });


    it('GET /todos/search - should return search results for todos', async () => {
      let query = 'test';//adjust to match a case;
      const response = await request(app.getHttpServer())
        .get('/todos/search')
        .set('Authorization', `Bearer ${jwtToken}`)
        .query({ query })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todos retrieved successfully',
          data: expect.any(Array),
        }),
      );
    });

    it('DELETE /todos/delete/:id - should delete a specific todo', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/todos/delete/${todoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Todo deleted successfully',
        }),
      );
    });
  });
});
