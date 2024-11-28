import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// Added Prisma types for better type safety
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // Added Prisma service injection for database operations
  constructor(private readonly prismaService: PrismaService) {}

  // Added user creation with password hashing and error handling
  async createUser(data: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          // Hash password before storing
          password: await bcrypt.hash(data.password, 10),
        },
        // Select only safe fields to return (exclude password)
        select: {
          email: true,
          id: true,
        },
      });
    } catch (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw error;
    }
  }

  // Added user retrieval method with type-safe filter
  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }
}
