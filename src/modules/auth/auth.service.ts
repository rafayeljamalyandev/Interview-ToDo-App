import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from 'src/libs/dto/register.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { BaseResponseDto } from 'src/libs/dto/reponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   *
   * Checks email availability, hashes the password, creates the user, and returns the user info.
   *
   * @param data - Registration data (email and password).
   * @returns A BaseResponseDto with status, message, and created user data.
   * @throws {ConflictException} If the email is already in use.
   */
  async register(
    data: RegisterDto,
  ): Promise<BaseResponseDto<number, string, User>> {
    const { password, email } = data;
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    return {
      status: 200,
      message: 'User created successfully',
      data: newUser,
    };
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginDto - User credentials (email and password).
   * @returns A promise with the login status, message, and JWT token.
   * @throws {NotFoundException} If the user is not found or credentials are invalid.
   */
  async login(
    loginDto: LoginDto,
  ): Promise<BaseResponseDto<number, string, string>> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new NotFoundException('Invalid credentials');
    }

    const token = await this.generateToken(user);

    return {
      status: 200,
      message: 'Login successful',
      data: token,
    };
  }

  /**
   * Generates a token from the provided credentials
   * @param user
   * @returns jwt token
   */
  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }
}
