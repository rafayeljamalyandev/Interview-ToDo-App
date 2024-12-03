import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('TodoService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    prismaMock.user.create.mockClear();
    prismaMock.user.findUnique.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const newUser = { id: 1, email: 'user@test.com', password: 'test' };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockReturnValue(newUser);

      const userTokens = await service.register(newUser);
      expect(userTokens).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const existingUser = {
        id: 1,
        email: 'user@test.com',
        password:
          '$2a$12$BCTWFHieQ43vi8G3Mm.Gs.krSo7Xx8sbVwr1FUzfn69iYEPjCOnXa',
      };

      let mockResponse: Partial<Response>;

      mockResponse = {
        cookie: jest.fn(),
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      const userTokens = await service.login(
        {
          email: 'user@test.com',
          password: 'test',
        },
        mockResponse as Response,
      );

      expect(userTokens).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
      });
    });
  });
});
