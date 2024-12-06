import { PrismaService } from '../../../../libs/common/src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterDto } from '../../src/dto/register.dto';
import { LoginDto } from '../../src/dto/login.dto';

if (!process.env.DATABASE_URL.endsWith('test')) {
  console.warn('Tests are only allowed to run on test database.');
  process.exit(0);
}

describe('AuthService', () => {
  let authService: AuthService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation(() => 'access_token'),
    signAsync: jest
      .fn()
      .mockImplementation(() => Promise.resolve('access_token')),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  jest.spyOn(argon2, 'hash').mockImplementation(async (password: string) => {
    return `$argon2id$v=19$m=65536,t=3,p=4$ylwCEDnp20nD/3aj2b0hHQ${password}`;
  });

  jest
    .spyOn(argon2, 'verify')
    .mockImplementation(async (hashed: string, plain: string) => {
      return plain === 'password';
    });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = { id: 1, email: dto.email };

      mockPrismaService.user.create.mockResolvedValue(user);
      mockJwtService.sign.mockResolvedValue('access_token');
      mockConfigService.get.mockReturnValue('secret');

      const result = await authService.register(dto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email: dto.email, password: await argon2.hash(dto.password) },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        { expiresIn: '15m', secret: 'secret' },
      );
    });

    it('should throw ForbiddenException if email is already taken', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const error = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '1.0.0',
        },
      );

      mockPrismaService.user.create.mockRejectedValue(error);

      await expect(authService.register(dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password' };
      const user = {
        id: 1,
        email: dto.email,
        password: await argon2.hash(dto.password),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValueOnce('access_token');
      mockJwtService.sign.mockReturnValueOnce('refresh_token');
      mockConfigService.get.mockReturnValue('secret');

      const result = await authService.login(dto);
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        { expiresIn: '15m', secret: 'secret' },
      );
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      const dto: LoginDto = {
        email: 'unknown@example.com',
        password: 'password',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const user = {
        id: 1,
        email: dto.email,
        password: await argon2.hash('password'),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refreshTokens', () => {
    it('should successfully refresh tokens', async () => {
      const userId = 1;
      const refreshToken = 'valid_refresh_token';
      const user = { id: userId, email: 'test@example.com', refreshToken };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockResolvedValue('new_access_token');
      mockConfigService.get.mockReturnValue('secret');

      const tokens = await authService.refreshTokens(userId, refreshToken);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshToken: tokens.refreshToken },
      });
    });

    it('should throw ForbiddenException for invalid refresh token', async () => {
      const userId = 1;
      const invalidRefreshToken = 'invalid_refresh_token';
      const user = {
        id: userId,
        email: 'test@example.com',
        refreshToken: 'valid_refresh_token',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(
        authService.refreshTokens(userId, invalidRefreshToken),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user is not found', async () => {
      const userId = 1;
      const refreshToken = 'valid_refresh_token';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.refreshTokens(userId, refreshToken),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
