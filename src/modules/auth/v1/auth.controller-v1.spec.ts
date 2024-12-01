import { Test, TestingModule } from '@nestjs/testing';
import { AuthControllerV1 } from './auth.controller-v1';
import { AuthServiceV1 } from './auth.service-v1';
import { AuthRepository } from '../auth.repository';
import { AuthMappingV1 } from './mappings/auth.mappings-v1';
import { ReqLoginDTO, ReqRegisterDTO } from './dto/request.dto';
import { ResLoginDTO, ResRegisterDTO } from './dto/response.dto';

describe('AuthControllerV1', () => {
  let authController: AuthControllerV1;
  let authServiceMock: AuthServiceV1;
  let authRepositoryMock: jest.Mocked<AuthRepository>;
  let authMappingMock: jest.Mocked<AuthMappingV1>;

  beforeEach(async () => {
    // Mock the AuthRepository and AuthMapping
    authRepositoryMock = {
      findOne: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    authMappingMock = {
      loginResMapping: jest.fn(),
      registerResMapping: jest.fn(),
    } as unknown as jest.Mocked<AuthMappingV1>;

    // Mock the AuthServiceV1 methods
    authServiceMock = new AuthServiceV1(authRepositoryMock, authMappingMock);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthControllerV1],
      providers: [
        {
          provide: AuthServiceV1,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthControllerV1>(AuthControllerV1);
  });

  it('should register a new user successfully', async () => {
    const mockBody: ReqRegisterDTO = {
      email: 'test@example.com',
      password: 'testPassword',
    };

    const mockResponse: ResRegisterDTO = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    // Mock the service method
    authServiceMock.register = jest.fn().mockResolvedValue(mockResponse);

    // Call the controller method
    const result = await authController.register(mockBody);

    // Check if the result matches the expected response DTO
    expect(result).toEqual(mockResponse);
    expect(authServiceMock.register).toHaveBeenCalledWith(mockBody);
  });

  it('should login a user successfully', async () => {
    const mockBody: ReqLoginDTO = {
      email: 'test@example.com',
      password: 'testPassword',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    const mockToken = 'mockJwtToken';
    const mockResponse: ResLoginDTO = {
      email: mockUser.email,
      token: mockToken,
    };

    // Mock the service method to return only email and token
    authServiceMock.login = jest.fn().mockResolvedValue(mockResponse);

    // Call the controller method
    const result = await authController.login(mockBody);

    // Check if the result matches the expected response DTO
    expect(result).toEqual(mockResponse);
    expect(authServiceMock.login).toHaveBeenCalledWith(mockBody);
  });
});
