import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from 'src/services/users/users.service';
import { TokenService } from 'src/common/token/token.service';
import { IUser } from 'src/services/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: AuthDto): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    dto.password = hashedPassword;
    const user = await this.usersService.create(dto);
    const payload = { sub: user.id };
    const authToken = this.tokenService.sign(payload);
    return this.usersService.genIUser(user, authToken);
  }

  async login(dto: AuthDto): Promise<IUser> {
    try {
      const user = await this.usersService.getByEmail(dto.email);
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.id };
      const authToken = this.tokenService.sign(payload);
      return this.usersService.genIUser(user, authToken);
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
