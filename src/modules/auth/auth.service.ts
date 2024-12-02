import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../../lib/bcrypt';
import { GenerateTokenService } from '../../lib/utils';
import { RegisterUser, LoginUser } from '../../types/user.types';
import { PrismaService } from '../../prisma.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly generateToken: GenerateTokenService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  // Register a new user
  async register(data: RegisterUser) {
    try {
      const { email, password } = data;
      // Check if the user already exists
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      // Hash the password
      const hashedPassword = await this.bcryptService.hashPassword(password);

      // Create the user in the database
      const newUser = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {
        message: 'User registered successfully',
        user: newUser,
      };
    } catch (error) {
      this.logger.error('Error during registration', error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Registration failed');
    }
  }

  // Login user and generate JWT
  async login(data: LoginUser) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.bcryptService.decryptPassword(
        data.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateToken.generateToken(user.id);

      return {
        message: 'Login successful',
        token,
      };
    } catch (error) {
      this.logger.error('Error during login', error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Login failed');
    }
  }
}
