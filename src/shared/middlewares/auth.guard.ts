import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`Auth Failed: ${authHeader}`);
      throw new UnauthorizedException('Authentication Failed');
    }

    const token = authHeader.split(' ')[1];
    try {
      const userInfo = this.jwtService.verify(token);
      request.user = { ...userInfo };

      return true;
    } catch (err) {
      console.log(`Token Verification Failed: ${token}\n`, err);
      throw new UnauthorizedException('Authentication Failed');
    }
  }
}
