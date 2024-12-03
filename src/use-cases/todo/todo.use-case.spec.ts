import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {UserLoginDto} from "../../core/dtos";
import {UserNotFoundException} from "../../core/exceptions/user-not-found-exception";
import {IDataServices} from "../../core";
import {PrismaDataServices} from "../../frameworks/data-services/mysql/prisma-data-services";
import {UserUseCases} from "../user/user.use-case";
import {PrismaService} from "../../frameworks/data-services/mysql/prisma.service";
import {UserFactoryService} from "../user/user-factory.service";
import {ConfigModule, ConfigService} from '@nestjs/config';



describe('AuthUseCase', () => {
  let config: ConfigService
  let prismaService: PrismaService;
  let userUseCase: UserUseCases;
  let mockDataServices: {
    user: {
      login: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockDataServices = {
      user: {
        login: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],

      providers: [
        PrismaService,
        UserUseCases,UserFactoryService,
        {
          provide: IDataServices,
          useClass: PrismaDataServices,
        },
      ],
    }).compile();
    prismaService = module.get<PrismaService>(PrismaService);
    userUseCase = module.get<UserUseCases>(UserUseCases);
  });

  describe('login', () => {
    const mockUserLoginDto: UserLoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    it('should successfully login and return a JWT token when credentials are correct', async () => {
      mockDataServices.user.login.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockedJwtToken');

      const result = await userUseCase.login(mockUserLoginDto);

      expect(mockDataServices.user.login).toHaveBeenCalledWith(
          mockUserLoginDto.email,
          mockUserLoginDto.password
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
          mockUserLoginDto.password,
          mockUser.password
      );
      expect(result).toBe('mockedJwtToken');
    });

    // it('should throw UserNotFoundException when user is not found', async () => {
    //   mockDataServices.user.login.mockResolvedValue(null);
    //
    //   await expect(userUseCase.login(mockUserLoginDto)).rejects.toThrow(UserNotFoundException);
    // });

    // it('should throw UserNotFoundException when password is incorrect', async () => {
    //   // Mock the login method to return a user
    //   mockDataServices.user.login.mockResolvedValue(mockUser);
    //
    //   // Mock bcrypt comparison to return false (incorrect password)
    //   jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
    //
    //   await expect(userUseCase.login(mockUserLoginDto)).rejects.toThrow(UserNotFoundException);
    // });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });
});