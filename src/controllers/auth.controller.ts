import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { CreateUserDto } from 'src/dto/user-create.dto'; // пример DTO для валидации входных данных
import { LoginDto } from 'src/dto/login.dto'; // пример DTO для валидации входных данных

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    try {
      const user = await this.authService.register(body.email, body.password);
      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const token = await this.authService.login(body.email, body.password);
      if (!token) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return { message: 'Login successful', token };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
