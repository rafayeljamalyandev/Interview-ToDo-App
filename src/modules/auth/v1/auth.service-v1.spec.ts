import { UnauthorizedException } from '@nestjs/common';
import { HashPassword, ComparePassword } from '../../../lib/bcrypt/bcrypt';
import { AuthServiceV1 } from './auth.service-v1';
import { AuthRepository } from '../auth.repository';
import { AuthMappingV1 } from './mappings/auth.mappings-v1';
import { JWTSign } from '../../../lib/jwt/jwt';

// Mock bcrypt functions
jest.mock('../../../lib/bcrypt/bcrypt', () => ({
  HashPassword: jest.fn(),
  ComparePassword: jest.fn(),
}));

// Mock JWTSign
jest.mock('../../../lib/jwt/jwt', () => ({
  JWTSign: jest.fn(),
}));

describe('AuthServiceV1', () => {
  let authService: AuthServiceV1;
  let authRepositoryMock: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepositoryMock = {
      findOne: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    authService = new AuthServiceV1(authRepositoryMock, new AuthMappingV1());
  });

  it('should register a new user successfully', async () => {
    const mockBody = { email: 'test@example.com', password: 'testPassword' };

    // Mock the repository to return null for findOne (no user exists)
    authRepositoryMock.findOne.mockResolvedValue(null);

    // Mock HashPassword to return a fixed hashed value
    (HashPassword as jest.Mock).mockResolvedValue('hashedPassword');

    // Call the service method
    await authService.register(mockBody);

    // Expect createUser to be called with the mocked hashed password
    expect(authRepositoryMock.createUser).toHaveBeenCalledWith({
      email: mockBody.email,
      password: 'hashedPassword',
    });
  });

  it('should login a user successfully', async () => {
    const mockBody = { email: 'test@example.com', password: 'testPassword' };
    const mockUser = {
      id: 1,
      email: mockBody.email,
      password: 'hashedPassword',
    };
    const mockToken = 'mockJwtToken';

    // Mock repository and bcrypt functions
    authRepositoryMock.findOne.mockResolvedValue(mockUser);
    (ComparePassword as jest.Mock).mockResolvedValue(true); // Simulate password match

    // Mock JWTSign to return a mock JWT token
    (JWTSign as jest.Mock).mockResolvedValue(mockToken); // Simulate JWT token generation

    const result = await authService.login(mockBody);

    expect(result).toEqual({ token: mockToken, email: mockUser.email });
  });

  it('should throw UnauthorizedException for wrong password', async () => {
    const mockBody = { email: 'test@example.com', password: 'wrongPassword' };
    const mockUser = {
      id: 1,
      email: mockBody.email,
      password: 'hashedPassword',
    };

    // Mock repository and bcrypt functions
    authRepositoryMock.findOne.mockResolvedValue(mockUser);
    (ComparePassword as jest.Mock).mockResolvedValue(false); // Simulate wrong password

    await expect(authService.login(mockBody)).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
