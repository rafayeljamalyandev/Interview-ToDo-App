import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AuthService } from 'src/auth.service';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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

    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'mockHashedPassword');
    jest.spyOn(jwt, 'sign').mockReturnValue('mockJwtToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const email = faker.internet.email();
      const password = 'StrongPass1!';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 1,
        email,
        password: 'mockHashedPassword',
      });

      const result = await authService.register(email, password);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { email, password: 'mockHashedPassword' },
      });
      expect(result).toEqual({
        message: 'User created successfully',
        data: { id: 1, email, password: 'mockHashedPassword' },
      });
    });

    it('should throw an error if email is already in use', async () => {
      const email = faker.internet.email();
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({ id: 1, email, password: 'mockHashedPassword' });

      await expect(authService.register(email, 'StrongPass1!')).rejects.toThrow(
        'Email already in use',
      );
    });

    it('should throw an error if password is not strong', async () => {
      const email = faker.internet.email();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.register(email, 'weakpass')).rejects.toThrow(
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      );
    });
  });

  describe('login', () => {
    it('should successfully log in a user and return a JWT token', async () => {
      const email = faker.internet.email();
      const password = 'StrongPass1!';
      const hashedPassword = 'mockHashedPassword';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      expect(result).toEqual({ message: 'Login successful', token: 'mockJwtToken' });
    });

    it('should throw an error if credentials are invalid', async () => {
      const email = faker.internet.email();
      const password = 'StrongPass1!';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw an error if JWT_SECRET is not defined', async () => {
      const email = faker.internet.email();
      const password = 'StrongPass1!';
      const hashedPassword = 'mockHashedPassword';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 1,
        email,
        password: hashedPassword,
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const originalJwtSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      await expect(authService.login(email, password)).rejects.toThrow(
        'JWT_SECRET is not defined in the environment variables',
      );

      process.env.JWT_SECRET = originalJwtSecret; // Restore for other tests
    });
  });
});
