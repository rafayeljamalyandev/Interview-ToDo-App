import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthDto } from 'src/app/auth/dto/auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: AuthDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: dto,
    });
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  genIUser(user: User, authToken: string): IUser {
    return {
      sub: user.id,
      authToken,
    };
  }
}
