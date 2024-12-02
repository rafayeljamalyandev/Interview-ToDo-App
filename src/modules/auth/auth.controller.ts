import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUser, RegisterUser } from '../../types/user.types'; // Adjust import path if needed

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterUser) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() body: LoginUser) {
    return this.authService.login(body);
  }
}
