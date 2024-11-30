import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { todos: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const { email, password, name } = updateUserDto;

    // If email is being updated, check if it's already taken
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async getTodoStats(userId: number) {
    const [totalTodos, completedTodos] = await Promise.all([
      this.prisma.todo.count({
        where: { userId },
      }),
      this.prisma.todo.count({
        where: {
          userId,
          completed: true,
        },
      }),
    ]);

    const pendingTodos = totalTodos - completedTodos;
    const completionRate =
      totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    return {
      total: totalTodos,
      completed: completedTodos,
      pending: pendingTodos,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
    };
  }
}
