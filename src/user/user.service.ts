import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { REGISTRATION_ERROR } from './user.constants';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async register(userDto: UserDto) {
    try {
      const hashedPassword = await this.hashedPassword(userDto.password);

      const user = await this.prisma.user.create({
        data: { email: userDto.email, password: hashedPassword },
      });

      return { id: user.id, email: user.email };
    } catch (error) {
      throw new HttpException(REGISTRATION_ERROR, HttpStatus.FORBIDDEN);
    }
  }

  async hashedPassword(password: string) {
    const saltRounds = +this.configService.get('BCRYPT_SALT_ROUNDS', 10);
    return bcrypt.hash(password, saltRounds);
  }
}
