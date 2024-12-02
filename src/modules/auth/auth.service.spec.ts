import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BcryptService } from '../../lib/bcrypt';
import { GenerateTokenService } from '../../lib/utils';
import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';

// Mocking the services
const mockBcryptService = {
  hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
  decryptPassword: jest.fn().mockResolvedValue(true),
};

const mockGenerateTokenService = {
  generateToken: jest.fn().mockReturnValue('some-token'),
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockConfigService = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: GenerateTokenService, useValue: mockGenerateTokenService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a new user successfully', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    const result = await service.register({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.message).toBe('User registered successfully');
    expect(mockPrismaService.user.create).toHaveBeenCalled();
  });
});
