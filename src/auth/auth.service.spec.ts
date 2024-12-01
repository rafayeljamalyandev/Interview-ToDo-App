import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JWTService } from '../common/services/jwt.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { RegisterDto, SignInResponse } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ERROR_MESSAGES, VALIDATION_ERROR_MESSAGES } from '../common/constants/responseMessages.constant';
import { validate } from 'class-validator';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JWTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JWTService,
          useValue: {
            encodePassword: jest.fn(),
            comparePasswords: jest.fn(),
            generateJwt: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JWTService>(JWTService);
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        firstName: 'test name',
        lastName: 'test last name',
        email: 'test@example.com',
        password: 'sdjfsFE#$dkjldf545',
      };

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue({ id: 1 } as any);

      await expect(authService.register(registerDto)).rejects.toThrow(
        new ConflictException(ERROR_MESSAGES.USER_EMAIL_EXISTS),
      );
    });

    it('should create a new user successfully', async () => {
      const registerDto: RegisterDto = {
        firstName: 'test name',
        lastName: 'test last name',
        email: 'test@example.com',
        password: 'sdjfsFE#$dkjldf545',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(jwtService, 'encodePassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 1,
        email: registerDto.email,
        password: 'hashedPassword',
      } as any);

      const result = await authService.register(registerDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: 'hashedPassword',
        },
      });
      expect(result).toEqual({
        id: 1,
        email: registerDto.email,
      });
    });
  });

  describe('login', () => {
    it('should throw ConflictException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new ConflictException(ERROR_MESSAGES.USER_NOT_FOUND),
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      } as any);
      jest.spyOn(jwtService, 'comparePasswords').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new BadRequestException(ERROR_MESSAGES.INVALID_CREDENTIALS),
      );
    });

    it('should return user and access token if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: 'hashedPassword',
      } as any);
      jest.spyOn(jwtService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(jwtService, 'generateJwt').mockResolvedValue('accessToken');

      const result: SignInResponse = await authService.login(loginDto);

      expect(jwtService.comparePasswords).toHaveBeenCalledWith(
        loginDto.password,
        'hashedPassword',
      );
      expect(jwtService.generateJwt).toHaveBeenCalledWith('1', loginDto.email);
      expect(result).toEqual({
        user: { id: 1, email: loginDto.email },
        accessToken: 'accessToken',
      });
    });
  });
});

describe('RegisterDto Validation', () => {

  it('should pass validation with valid data', async () => {
    const dto = new RegisterDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'Password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when firstName is too long', async () => {
    const dto = new RegisterDto();
    dto.firstName = 'A'.repeat(51);
    dto.lastName = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'Password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      maxLength: VALIDATION_ERROR_MESSAGES.INVALID_FIRSTNAME,
    });
  });

  it('should fail validation when lastName is too short', async () => {
    const dto = new RegisterDto();
    dto.firstName = 'John';
    dto.lastName = ''; // Empty lastName
    dto.email = 'john.doe@example.com';
    dto.password = 'Password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: VALIDATION_ERROR_MESSAGES.INVALID_LASTNAME,
    });
  });

  it('should fail validation when email format is invalid', async () => {
    const dto = new RegisterDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'invalid-email'; // invalid email
    dto.password = 'Password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: VALIDATION_ERROR_MESSAGES.INVALID_EMAIL,
    });
  });

  it('should fail validation when password is invalid', async () => {
    const dto = new RegisterDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'short'; // Invalid password

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      matches: VALIDATION_ERROR_MESSAGES.INVALID_PASSWORD,
    });
  });

  it('should pass validation when optional fields are omitted', async () => {
    const dto = new RegisterDto();
    dto.email = 'john.doe@example.com';
    dto.password = 'Password123'; // Only required fields provided

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
