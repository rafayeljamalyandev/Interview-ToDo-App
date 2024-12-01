import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};

const mockJwtService = {
    sign: jest.fn(),
};

describe('UserService', () => {
    let service: UserService;
    let prisma: typeof mockPrismaService;
    let jwtService: typeof mockJwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get(PrismaService);
        jwtService = module.get(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = { id: 1, email: 'test@example.com' };
            const dto = { email: 'test@example.com', password: 'Password123!' };
            const hashedPassword = 'hashedPassword123';

            prisma.user.findUnique.mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
            prisma.user.create.mockResolvedValue(mockUser);
            jwtService.sign.mockReturnValue('mockToken');

            const result = await service.register(dto);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: dto.email, password: hashedPassword },
                select: { email: true, id: true },
            });
            expect(result).toEqual({ user: mockUser, token: 'mockToken' });
        });

        it('should throw ConflictException if email is already registered', async () => {
            const dto = { email: 'test@example.com', password: 'Password123!' };

            prisma.user.findUnique.mockResolvedValue({ id: 1, email: dto.email });

            await expect(service.register(dto)).rejects.toThrow(ConflictException);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
        });

        it('should throw InternalServerErrorException on database error', async () => {
            const dto = { email: 'test@example.com', password: 'Password123!' };

            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockRejectedValue(new Error('Database error'));

            await expect(service.register(dto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('login', () => {
        it('should login a user successfully', async () => {
            const dto = { email: 'test@example.com', password: 'Password123!' };
            const mockUser = { id: 1, email: dto.email, password: 'hashedPassword123' };

            prisma.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
            jwtService.sign.mockReturnValue('mockToken');

            const result = await service.login(dto);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
            expect(result).toEqual({
                user: { id: mockUser.id, email: mockUser.email },
                token: 'mockToken',
            });
        });

        it('should throw UnauthorizedException if email does not exist', async () => {
            const dto = { email: 'test@example.com', password: 'Password123!' };

            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const dto = { email: 'test@example.com', password: 'WrongPassword123' };
            const mockUser = { id: 1, email: dto.email, password: 'hashedPassword123' };

            prisma.user.findUnique.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw InternalServerErrorException on database error', async () => {
            const dto = { email: 'test@example.com', password: 'Password123!' };

            prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

            await expect(service.login(dto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('hashPassword', () => {
        it('should hash a password correctly', async () => {
            const password = 'Password123!';
            const hashedPassword = 'hashedPassword123';

            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

            const result = await service['hashPassword'](password);
            expect(result).toBe(hashedPassword);
        });
    });

    describe('comparePassword', () => {
        it('should return true if passwords match', async () => {
            const password = 'Password123!';
            const hashedPassword = 'hashedPassword123';

            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            const result = await service['comparePassword'](password, hashedPassword);
            expect(result).toBe(true);
        });

        it('should return false if passwords do not match', async () => {
            const password = 'Password123!';
            const hashedPassword = 'hashedPassword123';

            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            const result = await service['comparePassword'](password, hashedPassword);
            expect(result).toBe(false);
        });
    });

    describe('signToken', () => {
        it('should sign a JWT token correctly', () => {
            const payload = { id: 1, email: 'test@example.com' };
            jwtService.sign.mockReturnValue('mockToken');

            const result = service['signToken'](payload);
            expect(result).toBe('mockToken');
            expect(jwtService.sign).toHaveBeenCalledWith({ sub: payload.id, email: payload.email });
        });
    });
});
