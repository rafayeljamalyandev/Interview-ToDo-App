import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/db/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
