import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';



const prisma = new PrismaClient();
describe('AuthService', () => {

    beforeAll(async ()=>{
        await prisma.$connect();
    })

  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = { 
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword' ,
        createdAt: new Date(),
        updatedAt: new Date(),
        
    };
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      const result = await service.register('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: expect.any(String) },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new PrismaClientKnownRequestError("Unauthorized",{code:'P2002',clientVersion:""}));

      await expect(service.register('test@example.com', 'password123')).rejects.toThrow (
        ConflictException,
      );
    });
    

    it('should throw UnauthorizedException if authentication fails', async () => {
        jest.spyOn(prismaService.user, 'create').mockRejectedValue(new UnauthorizedException('Unauthorized'));

        await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      jest.spyOn(prismaService.user, 'create').mockRejectedValue(new InternalServerErrorException('Unknown error'));

      await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' ,createdAt: new Date(),
        updatedAt: new Date(),};
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

      const result = await service.login('test@example.com', 'password123');
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@example.com', sub: 1 });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' ,createdAt: new Date(),
        updatedAt: new Date(),};
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login('test@example.com', 'wrongPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(new Error('Database error'));

      await expect(service.login('test@example.com', 'password123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });



  describe('register', () => {
  it('should throw ConflictException if email already exists', async () => {
    jest.spyOn(prismaService.user, 'create').mockRejectedValue(
      new PrismaClientKnownRequestError("Unauthorized", { code: 'P2002', clientVersion: "" }),
    );

    await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
      ConflictException,
    );
  });

  it('should throw UnauthorizedException if authentication fails', async () => {
    jest.spyOn(prismaService.user, 'create').mockRejectedValue(new UnauthorizedException('Unauthorized'));

    await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw InternalServerErrorException for other errors', async () => {
    jest.spyOn(prismaService.user, 'create').mockRejectedValue(new InternalServerErrorException('Unknown error'));

    await expect(service.register('test@example.com', 'password123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

  afterAll(async()=>{
    
    await prisma.$disconnect;
  })


});
