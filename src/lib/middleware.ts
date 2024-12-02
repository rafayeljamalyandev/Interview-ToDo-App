import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  private extractToken(req: Request): string {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      const token: string = req.headers.authorization.split(' ')[1];
      return token;
    } else {
      return null;
    }
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Access denied. No token provided.');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      (req as any).user = decoded;
      next();
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      this.handleTokenError(error);
    }
  }

  private handleTokenError(error: Error) {
    switch (error.name) {
      case 'TokenExpiredError':
        throw new UnauthorizedException('Token expired.');
      case 'JsonWebTokenError':
        throw new UnauthorizedException('Invalid token.');
      default:
        throw new UnauthorizedException('Token verification failed.');
    }
  }
}
