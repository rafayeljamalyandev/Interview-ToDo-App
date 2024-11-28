import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ms = require('ms');
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // Moved from direct Prisma usage to UserService for better separation of concerns
    private readonly userService: UsersService,
    // Added ConfigService for environment variables instead of hardcoded values
    private readonly configService: ConfigService,
    // Using NestJS JWT service instead of raw jsonwebtoken
    private readonly jwtService: JwtService,
  ) {}

  // Improved login method with proper cookie handling and token expiration
  async login(user: User, response: Response) {
    // Calculate token expiration using ms library for human-readable durations
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
    );

    // Structured token payload using interface for type safety
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    // Using JwtService instead of raw jwt.sign
    const token = this.jwtService.sign(tokenPayload);

    // Setting secure cookie instead of returning raw token
    response.cookie('Authentication', token, {
      secure: true, // Only sent over HTTPS
      httpOnly: true, // Prevents JavaScript access
      expires, // Auto-expires the cookie
    });

    return { tokenPayload };
  }

  // New method for user verification with proper error handling
  async verifyUser(email: string, password: string) {
    try {
      // Using UserService instead of direct Prisma calls
      const user = await this.userService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      // Proper error handling with specific message
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}
