import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { ITokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  sign(payload: ITokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });
  }

  verify(token: string): ITokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error: any) {
      throw new UnauthorizedException();
    }
  }

  extractToken(request: Request): string | undefined {
    const [key, token] = request.headers.authorization?.split(' ') ?? [];
    return key === 'Bearer' ? token : undefined;
  }

  decode(token: string): ITokenPayload {
    return this.jwtService.decode(token);
  }
}
