import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, SignInResponse } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ERROR_MESSAGES } from '../common/constants/responseMessages.constant';
import { IUser } from '../common/interfaces/user.interface';
import { JWTService } from '../common/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JWTService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (userExists) {
      throw new ConflictException(ERROR_MESSAGES.USER_EMAIL_EXISTS);
    }

    const hashedPassword = await this.jwtService.encodePassword(
      registerDto.password,
    );

    const user = await this.prisma.user.create({
      data: { ...registerDto, password: hashedPassword },
    });

    delete user.password;

    return user;
  }

  async login(loginDto: LoginDto): Promise<SignInResponse> {
    const user: IUser = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new ConflictException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const compareSuccess = await this.jwtService.comparePasswords(
      loginDto.password,
      user.password,
    );

    if (!user || !compareSuccess) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const jwt = await this.jwtService.generateJwt(
      user.id.toString(),
      user.email,
    );

    delete user.password;

    return {
      user,
      accessToken: jwt,
    };
  }
}
