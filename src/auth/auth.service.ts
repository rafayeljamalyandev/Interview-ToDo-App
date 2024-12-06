import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthDto } from './auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { INVALID_CREDENTIALS, USER_NOT_FOUND } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: authDto.email },
    });

    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isPasswordEqual = await bcrypt.compare(
      authDto.password,
      user.password,
    );

    if (!isPasswordEqual) {
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.FORBIDDEN);
    }

    const secretKey = this.configService.get<string>('JWT_SECRET');
    const tokenExpire = this.configService.get<string>('JWT_EXPIRE', '1h');

    const accessToken = jwt.sign({ user: user.id }, secretKey, {
      expiresIn: tokenExpire,
    });

    return { accessToken };
  }
}
