import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtAuthGuard = {
  canActivate: jest.fn(),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should create a new user and return a token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({
        id: 1,
        email: 'newuser@domain.com',
        name: 'Alice Johnson',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@domain.com',
          password: 'MySecurePass123',
          name: 'Alice Johnson',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should return a conflict error if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'existinguser@domain.com',
        name: 'Existing User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'existinguser@domain.com',
          password: 'MySecurePass123',
          name: 'Existing User',
        })
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate the user and return a token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'existinguser@domain.com',
        name: 'Existing User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'existinguser@domain.com',
          password: 'MySecurePass123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should return unauthorized error if credentials are invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@domain.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should return the profile of the authenticated user', async () => {
      const mockUser = {
        id: 1,
        email: 'existinguser@domain.com',
        name: 'Existing User',
      };
      jest.spyOn(mockJwtAuthGuard, 'canActivate').mockImplementationOnce((context: any): boolean => {
        const req = context.switchToHttp().getRequest();
        req.user = mockUser; // Inject mock user into req.user
        return true;
      });

      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        todos: [],
      });

      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      const expectedResponse = {
        id: 1,
        email: 'existinguser@domain.com',
        name: 'Existing User',
        todos: [],
      };

      expect(response.body).toEqual(expectedResponse);
    });

    it('should return unauthorized error if no token is provided', async () => {
      jest.spyOn(mockJwtAuthGuard, 'canActivate').mockImplementationOnce(() => false);

      await request(app.getHttpServer()).get('/auth/profile').expect(403);
    });
  });
});
