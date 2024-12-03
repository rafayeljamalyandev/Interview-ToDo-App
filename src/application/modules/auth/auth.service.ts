import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<Tokens> {
    const hash = await this.hashData(registerUserDto.password);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const newUser = await this.prisma.user.create({
      data: { email: registerUserDto.email, password: hash },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    return tokens;
  }

  async login(loginUserDto: LoginUserDto, resp: Response): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new NotFoundException('User is not registered');
    }
    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email);
    resp.cookie('access_token', tokens.access_token);
    resp.cookie('refresh_token', tokens.refresh_token);
    return tokens;
  }

  async refreshTokens(userId: number, resp: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    resp.cookie('access_token', tokens.access_token);
    resp.cookie('refresh_token', tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          // expiresIn: 60 * 15,
          expiresIn: 30,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
