import { Injectable } from '@nestjs/common';
import { ResLoginDTO } from '../dto/response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthMappingV1 {
  constructor() {}

  async loginResMapping(
    userData: Partial<User>,
    token: string,
  ): Promise<ResLoginDTO> {
    return {
      email: userData.email,
      token,
    };
  }
}
