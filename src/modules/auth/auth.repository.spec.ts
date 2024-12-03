import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../../config/db/prisma.service';
import { User } from '@prisma/client';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn() as jest.Mock,
      create: jest.fn() as jest.Mock,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    const result = await authRepository.findOne('test@example.com');

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should create a user', async () => {
    const mockUser: User = {
      id: 1,
      email: 'newuser@example.com',
      password: 'hashedPassword',
    };
    const createUserData = {
      email: 'newuser@example.com',
      password: 'hashedPassword',
    };

    mockPrismaService.user.create.mockResolvedValue(mockUser);

    const result = await authRepository.createUser(createUserData);

    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: createUserData,
    });
    expect(result).toEqual(mockUser);
  });
});
