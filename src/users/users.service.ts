import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id },
    });

    return user;
  }
}
