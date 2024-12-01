import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JWTService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async comparePasswords(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }
  async encodePassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async generateJwt(id: string, email: string): Promise<string> {
    const payload: JwtPayload = { id, email };

    return this.jwtService.sign(payload);
  }
}