require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Helper method to validate password strength
  private validatePassword(password: string): void {
    if (!validator.isStrongPassword(password)) {
      throw new HttpException(
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Helper method to ensure JWT_SECRET exists
  private getJwtSecret(): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new HttpException('JWT_SECRET is not defined in the environment variables', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return jwtSecret;
  }

  async register(email: string, password: string) {
    try {
      // Check for existing user
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }

      // Validate password strength
      this.validatePassword(password);

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      // Handle errors with consistent exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string) {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      // Generate JWT
      const jwtSecret = this.getJwtSecret();
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: '1h',
      });

      return {
        message: 'Login successful',
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
