import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtUser } from 'src/common/interfaces/jwt.interface';
import { JWTVerify } from 'src/lib/jwt/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Validate JWT Token
      const decoded: IJwtUser = await JWTVerify(token);
      request.user = decoded;

      return true;
    } catch (err) {
      console.log('Auth Guards error:', err);
      throw new InternalServerErrorException();
    }
  }
}
