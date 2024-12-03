import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ReqLoginDTO, ReqRegisterDTO } from './dto/request.dto';
import { AuthRepository } from '../auth.repository';
import { ComparePassword, HashPassword } from '../../../lib/bcrypt/bcrypt';

import { IAuthCreateUser } from './interface/auth.interface';
import { ResLoginDTO, ResRegisterDTO } from './dto/response.dto';
import { JWTSign } from '../../../lib/jwt/jwt';
import { AuthMappingV1 } from './mappings/auth.mappings-v1';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private authRepository: AuthRepository,
    private authMapping: AuthMappingV1,
  ) {}

  async register(body: ReqRegisterDTO): Promise<ResRegisterDTO> {
    const isUserExist = await this.authRepository.findOne(body.email);
    if (isUserExist) {
      throw new ConflictException(`User with ${body.email} already exist`);
    }
    const hashedPassword = await HashPassword(body.password);

    const newUserData: IAuthCreateUser = {
      email: body.email,
      password: hashedPassword,
    };

    return await this.authRepository.createUser(newUserData);
  }

  async login(body: ReqLoginDTO): Promise<ResLoginDTO> {
    const userData = await this.authRepository.findOne(body.email);
    // Check is user exist
    if (!userData) {
      throw new NotFoundException(`User with ${body.email} is not exist`);
    }

    //Compare password, return error if failed
    const comparePassword = await ComparePassword(
      body.password,
      userData.password,
    );

    if (comparePassword === false) {
      throw new UnauthorizedException('Wrong password');
    }

    const jwtToken = await JWTSign(userData.id);

    const mappedRes = await this.authMapping.loginResMapping(
      userData,
      jwtToken,
    );

    return mappedRes;
  }
}
