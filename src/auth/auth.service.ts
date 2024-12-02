import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  errorResponse,
  ServiceResponse,
  successResponse,
} from 'src/shared/utils';
import { AuthDto } from './dtos/auth.dto';
import { IUserRepository } from './models/repository.intf';
import { User } from './models/model';
import { CreateUserDto } from './dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userInfo: CreateUserDto): Promise<ServiceResponse> {
    try {
      const existingUser = await this.userRepository.getUserByEmail(
        userInfo.email,
      );
      if (existingUser) {
        return errorResponse('Email is already used', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      const user = new User(null, userInfo.email, hashedPassword);
      const newUser = await this.userRepository.createUser(user);

      // Will return Status = 201 for created resource (user)
      return successResponse(
        { id: newUser.id, email: newUser.email },
        HttpStatus.CREATED,
      );
    } catch (err) {
      return errorResponse(); // Will return Internal Server Error by default
    }
  }

  async login(authInfo: AuthDto): Promise<ServiceResponse> {
    try {
      const user = await this.userRepository.getUserByEmail(authInfo.email);
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
