import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidateUserDto } from './dto/validate-user.dto';
import { RegisterDto } from './dto/register.dto';
import { validate } from 'class-validator';
import { LoginDto } from './dto/login.dto';
import { generateToken } from '../../src/utils/jwt.utils';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  validateUser(user: ValidateUserDto) {
    return { userId: user.id, username: user.username };
  }

  // Helper method for DTO validation
  private async validateDto(dto: RegisterDto | LoginDto) {
    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors
        .map(
          (error) =>
            `${error.property}: ${Object.values(error.constraints).join(', ')}`,
        )
        .join(', ');
      throw new BadRequestException(errorMessages);
    }
  }
  // Helper method to check if the email already exists
  private async checkIfEmailExists(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }
  }

  async register(registerDto: RegisterDto) {
    await this.validateDto(registerDto);

    const { email, password } = registerDto;

    await this.checkIfEmailExists(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async login(loginDto: LoginDto) {
    await this.validateDto(loginDto);

    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    const { token, expiresIn } = generateToken(
      { userId: user.id },
      process.env.JWT_SECRET,
    );

    return {
      token,
      expiresIn,
    };
  }
}
