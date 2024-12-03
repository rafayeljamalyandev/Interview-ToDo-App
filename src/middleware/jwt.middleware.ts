require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env'),
  });
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new HttpException(
        'Authorization header is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('Generated Token:', token);

    if (!token) {
      throw new HttpException(
        'Authorization token is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new HttpException(
          'JWT_SECRET_KEY is not defined in environment variables',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Explicitly type the decoded token as `JwtPayload`
      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
      console.log('Decoded token:', jwt.verify(token, process.env.JWT_SECRET));

      if (!decoded || !decoded.userId) {
        throw new HttpException(
          'Invalid token payload',
          HttpStatus.UNAUTHORIZED,
        );
      }

      console.log('Decoded JWT:', decoded);

      req.user = decoded ; // Attach the userId to the request
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      } else if (error.name === 'JsonWebTokenError') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'An error occurred during token validation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
