import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from "src/modules/app.module";
import { PrismaService } from "src/services/prisma.service";

describe('AuthMiddleware (e2e)', () => {
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
  
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(401);
  
      expect(response.body.message).toBe('Authentication required');
    });
  
    it('should return 401 if invalid token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
  
      expect(response.body.message).toBe('Invalid token');
    });
  
    it('should allow access with a valid token', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('test123', 10),
        },
      });
  
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'test123' })
        .expect(200);
  
      const token = response.body.access_token;
  
      const todoResponse = await request(app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
  
      expect(todoResponse.body).toBeInstanceOf(Array);
  
      await prismaService.user.delete({ where: { id: user.id } });
    });
  
    afterEach(async () => {
      await prismaService.user.deleteMany();
    });
  });
  