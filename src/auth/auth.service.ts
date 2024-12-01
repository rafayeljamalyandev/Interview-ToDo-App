import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

      const payload = { userId: user.id };
      // Jwt Secret is set in Module config
      const token = await this.jwtService.signAsync(payload);
      return successResponse({ token: token });
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }
}
