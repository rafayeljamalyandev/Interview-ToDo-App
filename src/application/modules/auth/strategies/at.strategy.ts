import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (
            req.cookies &&
            'access_token' in req.cookies &&
            req.cookies.access_token.length > 0
          ) {
            return req.cookies.access_token;
          }
          return null;
        },
      ]),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
