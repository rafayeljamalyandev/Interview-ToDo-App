import { ConflictException, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { T_UserResponse, T_UserWithoutPassword } from '../types/user';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async register(userData: RegisterDto): Promise<T_UserResponse> {
    try {
      const { password, email } = userData;

      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Email is already registered',);
      }

      const hashedPassword = await this.hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
        select: {
          email: true,
          id: true,
        },
      });

      const token = this.signToken({ id: user.id, email: user.email });

      return { user, token };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `An error occurred while registering the user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async login(userData: LoginDto): Promise<T_UserResponse> {
    try {
      const { email, password } = userData;

      const user = await this.prisma.user.findUnique({ where: { email }, });

      if (!user || !(await this.comparePassword(password, user.password))) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.signToken({ id: user.id, email: user.email });

      const { password: _, ...userWithoutPassword } = user;

      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `An error occurred while logging in: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private signToken({ id, email }: T_UserWithoutPassword): string {
    const payload = { sub: id, email };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
