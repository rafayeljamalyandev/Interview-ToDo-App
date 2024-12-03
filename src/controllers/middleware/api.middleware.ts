import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  constructor(
      // private jwtService: JwtService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload=jwt.verify(token,process.env.JWT_SECRET || 'defaultSecret');
      if (!req.body) {
        req.body = {
          jwt: payload
        }
      } else {
        req.body.jwt = payload
      }
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
