import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '../../common/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.tokenService.extractToken(request);

    if (!token) throw new UnauthorizedException();

    try {
      this.tokenService.verify(token);
    } catch (error: any) {
      throw new HttpException(error.message, 401);
    }

    return true;
  }
}
