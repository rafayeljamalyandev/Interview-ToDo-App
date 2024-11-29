import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user and return success response', async () => {
      userService.findUserByEmail.mockResolvedValue(null);
      userService.createUser.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await authService.register({
        email: 'test@test.com',
        password: 'password',
      });

      expect(userService.findUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(userService.createUser).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'User created successfully',
        data: { id: 1, email: 'test@test.com' },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      userService.findUserByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      await expect(
        authService.register({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return JWT token if credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      userService.findUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        status: 200,
        message: 'Login successful',
        data: 'jwt-token',
      });
    });

    it('should throw NotFoundException for invalid credentials', async () => {
      userService.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
