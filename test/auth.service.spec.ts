import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto } from '../src/auth/dtos/user.dto';
import { User } from '../src/auth/models/model';
import { UserRepository } from '../src/auth/repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from 'src/auth/dtos/auth.dto';

describe('Authentication Service', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: UserRepository;
  let testEmail: string = 'test0@mail.com';
  let testPassword: string = '123456';

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        PrismaService,
        AuthService,
        { provide: 'IUserRepository', useClass: UserRepository },
        JwtService,
      ],
    }).compile();

    authService = testModule.get<AuthService>(AuthService);
    jwtService = testModule.get<JwtService>(JwtService);
    userRepository = testModule.get<UserRepository>('IUserRepository');
  });

  describe('Register New User', () => {
    it('Should Create a New User', async () => {
      const userInfo: CreateUserDto = {
        email: testEmail,
        password: testPassword,
      };
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);

      jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);
      jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValue(new User(null, userInfo.email, hashedPassword));

      const result = await authService.register(userInfo);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        userInfo.email,
      );
      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: null,
          email: userInfo.email,
        }),
      );

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('code', 201);
      expect(result.data).toHaveProperty('email', userInfo.email);
    });

    it('Should return 409 Conflict error if user is already exists', async () => {
      const userInfo: CreateUserDto = {
        email: testEmail,
        password: testPassword,
      };

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue(new User(null, userInfo.email, null));

      const result = await authService.register(userInfo);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        userInfo.email,
      );

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('code', 409);
      expect(result).toHaveProperty('data', null);
    });
  });

  describe('Login User', () => {
    it('Should Login and return JWT token', async () => {
      const authInfo: AuthDto = {
        email: testEmail,
        password: testPassword,
      };
      const hashedPassword = await bcrypt.hash(authInfo.password, 10);

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue(new User(null, authInfo.email, hashedPassword));
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwttoken');

      const result = await authService.login(authInfo);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        authInfo.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authInfo.password,
        hashedPassword,
      );
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('code', 200);
      expect(result.data).toHaveProperty('token', 'jwttoken');
    });

    it('Should return 401 Authentication Failed error if user not found', async () => {
      const authInfo: AuthDto = {
        email: `x${testEmail}`,
        password: testPassword,
      };

      jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);

      const result = await authService.login(authInfo);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        authInfo.email,
      );

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('code', 401);
      expect(result).toHaveProperty('data', null);
    });

    it('Should return 401 Authentication Failed error if password is not correct', async () => {
      const authInfo: AuthDto = {
        email: testEmail,
        password: `${testPassword}x`,
      };
      const hashedPassword = await bcrypt.hash(authInfo.password, 10);

      jest
        .spyOn(userRepository, 'getUserByEmail')
        .mockResolvedValue(new User(null, authInfo.email, hashedPassword));
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

      const result = await authService.login(authInfo);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        authInfo.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        authInfo.password,
        hashedPassword,
      );

      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('code', 401);
      expect(result).toHaveProperty('data', null);
    });
  });
});
