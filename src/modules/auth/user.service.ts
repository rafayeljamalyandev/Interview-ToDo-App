import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/libs/dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for.
   * @returns The user if found, otherwise null.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Finds a user by their ID.
   * @param email - The email address to search for.
   * @returns The user if found, otherwise null.
   * Note: The parameter name should be 'id' instead of 'email' to match the function's purpose.
   */
  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Creates a new user in the database.
   * @param data - The registration details for the new user.
   * @returns The created user object.
   */
  async createUser(data: RegisterDto): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
