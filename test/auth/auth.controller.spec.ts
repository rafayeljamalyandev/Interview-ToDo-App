import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth-guard';
import { RegisterDto } from '../../src/auth/dto/register.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

describe('AuthController', () => {

    beforeAll(async ()=>{
        await prisma.$connect();
    })
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  //contoller test for register
  describe('register', () => {
    it('should register a user and return a success message', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@example.com' };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: mockUser,
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto.email, registerDto.password);
    });

    it('should throw an error if registration fails', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password123' };
      mockAuthService.register.mockRejectedValue(new Error('Registration error'));

      await expect(controller.register(registerDto)).rejects.toThrow('Registration error');
    });
  });


  //controller test for login
  describe('login', () => {
    it('should login a user and return a token', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const mockToken = { accessToken: 'some.jwt.token' };

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        message: 'login successful',
        ...mockToken,
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should throw an error if login fails', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('profile', () => {
    it('should return the user profile for authenticated requests', async () => {
      const mockRequest = { user: { id: 1, email: 'test@example.com' } };
      const mockJwtAuthGuard = {
        canActivate: jest.fn().mockReturnValue(true),
      };

      Reflect.defineMetadata('guard', mockJwtAuthGuard, JwtAuthGuard);

      const result = await controller.profile(mockRequest);

      expect(result).toEqual(mockRequest.user);
    });
  });

  afterAll(async ()=>{
    await prisma.$disconnect();
  })
});
