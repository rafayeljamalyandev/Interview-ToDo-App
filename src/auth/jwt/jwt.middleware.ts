import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Use regex to match any version and skip JWT validation for /auth/register and /auth/login
    const versionedRegisterRoute = /^\/v[0-9]+(?:\.[0-9]+)*\/auth\/register$/;
    const versionedLoginRoute = /^\/v[0-9]+(?:\.[0-9]+)*\/auth\/login$/;

    // Skip JWT authentication for '/auth/register' and '/auth/login' routes
    if (
      versionedRegisterRoute.test(req.path) ||
      versionedLoginRoute.test(req.path)
    ) {
      return next();
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
