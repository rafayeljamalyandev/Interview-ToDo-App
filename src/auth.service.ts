require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Helper method to validate password strength
  private validatePassword(password: string): void {
    if (!validator.isStrongPassword(password)) {
      throw new HttpException(
        'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

   // Custom JWT generation helper function
   private generateJwtToken(payload: any): string {
    const secretKey = process.env.JWT_SECRET; 
    const options = { expiresIn: '1h' }; 
    return jwt.sign(payload, secretKey, options);
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

      console.log('Registering email:', email);

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Generated hashed password:', hashedPassword);
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword },
      });

      return {
        message: 'User created successfully',
        data: { id: user.id, email: user.email },
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
      console.log('Hash in DB:', user.password);
      console.log('Password matches:', await bcrypt.compare(password, user.password));


      // Generate JWT using jwtService
      const payload = { userId: user.id };
      const token = this.jwtService.sign(payload); 
      console.log('JWT payload:', payload);

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
