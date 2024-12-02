import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

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
            const payload = this.jwtService.verify(token);
            req['user'] = payload;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
