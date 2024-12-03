import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../models/model';
import { IUserRepository } from '../models/repository.intf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private UserFromDBModel(user: UserModel): User {
    if (!user) return null;
    return new User(user.id.toString(), user.email, user.password);
  }

  async createUser(userInfo: Partial<User>): Promise<User> {
    try {
      const newUser = await this.prisma.user.create({
        data: { email: userInfo.email, password: userInfo.password },
      });

      return this.UserFromDBModel(newUser);
    } catch (err) {
      // Log Error
      console.log('Error on creating User:', err);
      throw err;
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const id = parseInt(userId);
      const user = await this.prisma.user.findUnique({ where: { id: id } });

      return this.UserFromDBModel(user);
    } catch (err) {
      // Log Error
      console.log('Error on getting User info by id:', err);
      throw err;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      return this.UserFromDBModel(user);
    } catch (err) {
      // Log Error
      console.log('Error on getting User info by email:', err);
      throw err;
    }
  }
}
