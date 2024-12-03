import { Test, TestingModule } from '@nestjs/testing';
import { UserFactoryService } from './user-factory.service';
import { IDataServices } from '../../core/abstracts';
import { CreateUserDto, UserLoginDto } from '../../core/dtos';
import { User } from '../../core';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserNotFoundException } from '../../core/exceptions/user-not-found-exception';
import {UserUseCases} from "./user.use-case";

describe('UserUseCases', () => {
  let userUseCases: UserUseCases;
  let dataServices: IDataServices;
  let userFactoryService: UserFactoryService;

  beforeEach(async () => {
    // Create mock implementations that match the abstract repository interfaces
    const mockDataServices = {
      user: {
        register: jest.fn(),
        login: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      todo: {},
    } as unknown as IDataServices;

    const mockUserFactoryService = {
      createNewUser: jest.fn(),
      updateUser: jest.fn(),
    } as UserFactoryService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCases,
        { provide: IDataServices, useValue: mockDataServices },
        { provide: UserFactoryService, useValue: mockUserFactoryService },
      ],
    }).compile();

    userUseCases = module.get<UserUseCases>(UserUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    userFactoryService = module.get<UserFactoryService>(UserFactoryService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {

      const createUserDto: CreateUserDto = {
        name:"test",
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
      };

      jest.spyOn(userFactoryService, 'createNewUser').mockResolvedValue(expectedUser);

      jest.spyOn(dataServices.user, 'register').mockResolvedValue(expectedUser);

      const result = await userUseCases.register(createUserDto);

      expect(userFactoryService.createNewUser).toHaveBeenCalledWith(createUserDto);
      expect(dataServices.user.register).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('login', () => {
    it('should successfully login and return a JWT token', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const existingUser: User = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        createdAt: new Date(),
      };

      jest.spyOn(dataServices.user, 'login').mockResolvedValue(existingUser);

      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
      bcryptCompareSpy.mockResolvedValue(true as any);

      const jwtSignSpy = jest.spyOn(jwt, 'sign');

      process.env.JWT_SECRET = 'testSecret';

      const token = await userUseCases.login(userLoginDto);

      expect(dataServices.user.login).toHaveBeenCalledWith(userLoginDto.email, userLoginDto.password);
      expect(bcryptCompareSpy).toHaveBeenCalledWith(userLoginDto.password, existingUser.password);
      expect(jwtSignSpy).toHaveBeenCalled();
      expect(token).toBeDefined();

      bcryptCompareSpy.mockRestore();
      jwtSignSpy.mockRestore();
    });

    it('should throw UserNotFoundException when user is not found', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(dataServices.user, 'login').mockResolvedValue(null);

      await expect(userUseCases.login(userLoginDto)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw UserNotFoundException when password is incorrect', async () => {
      const userLoginDto: UserLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const existingUser: User = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
        createdAt: new Date(),
      };

      jest.spyOn(dataServices.user, 'login').mockResolvedValue(existingUser);

      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
      bcryptCompareSpy.mockResolvedValue(false as any);

      await expect(userUseCases.login(userLoginDto)).rejects.toThrow(UserNotFoundException);

      bcryptCompareSpy.mockRestore();
    });
  });
});