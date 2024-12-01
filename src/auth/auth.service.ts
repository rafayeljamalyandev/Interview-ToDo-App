import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';
import { AuthDto } from './dtos/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /* User Info can have a separate DTO based on the properties we declare for user,
     But here the user info is same as the info we need for Authentication, so I avoided defining a separate DTO */
  async register(userInfo: AuthDto): Promise<ServiceResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
      });
      if (user) {
        return errorResponse('Email is already used', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      const newUser = await this.prisma.user.create({
        data: { email: userInfo.email, password: hashedPassword },
      });

      // Will return Status = 201 for created resource (user)
      return successResponse(newUser, HttpStatus.CREATED);
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async login(authInfo: AuthDto): Promise<ServiceResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: authInfo.email },
      });
      if (!user || !(await bcrypt.compare(authInfo.password, user.password))) {
        return errorResponse('Invalid Credentials', HttpStatus.UNAUTHORIZED);
      }

      const secret = this.configService.get('JWT_SECRET');
      const payload = { userId: user.id };
      const token = jwt.sign(payload, secret);
      return successResponse({ token: token });
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }
}
