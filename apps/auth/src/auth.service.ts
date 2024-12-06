import { PrismaService } from "../../../libs/common/src/prisma/prisma.service";
import { UserType } from '../../../libs/common/src/common/types/user.type';
import * as argon2 from 'argon2';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await argon2.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });
      return this.generateAndStoreTokens(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.generateAndStoreTokens(user);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Invalid refresh token');
    }

    return this.generateAndStoreTokens(user);
  }

  private async generateAndStoreTokens(user: UserType) {
    const tokens = this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  private generateTokens(user: UserType) {
    const accessToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.config.get<string>('jwt.access_secret'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.config.get<string>('jwt.refresh_secret'),
        expiresIn: '30d',
      },
    );

    return { accessToken, refreshToken };
  }
}
