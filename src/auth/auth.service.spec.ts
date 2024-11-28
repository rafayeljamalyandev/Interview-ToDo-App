import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../../src/utils/jwt.utils';
import { ValidateUserDto } from './dto/validate-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('../../src/utils/jwt.utils', () => ({
  generateToken: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('validateUser', () => {
    it('should return the userId and username', () => {
      const user: ValidateUserDto = { id: '1', username: 'testuser' };
      const result = authService.validateUser(user);
      expect(result).toEqual({ userId: user.id, username: user.username });
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(authService as any, 'validateDto').mockResolvedValueOnce(null);
      jest
        .spyOn(authService as any, 'checkIfEmailExists')
        .mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
      (prismaService.user.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...registerDto,
      });

      const result = await authService.register(registerDto);
      expect(result).toEqual({ id: 1, ...registerDto });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: 'hashedPassword' },
      });
    });

    it('should throw ConflictException if email exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest
        .spyOn(authService as any, 'checkIfEmailExists')
        .mockImplementationOnce(() => {
          throw new ConflictException('Email is already in use');
        });

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = { id: 1, email: loginDto.email, password: 'hashedPassword' };
      jest.spyOn(authService as any, 'validateDto').mockResolvedValueOnce(null);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      (generateToken as jest.Mock).mockReturnValueOnce({
        token: 'jwtToken',
        expiresIn: 3600,
      });

      const result = await authService.login(loginDto);
      expect(result).toEqual({
        token: 'jwtToken',
        expiresIn: 3600,
      });
    });

    it('should throw BadRequestException if email or password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
