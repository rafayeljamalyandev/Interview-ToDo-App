import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { Response } from 'express';

/* I'm using @Res() decorator to have customized consistence response for all requests
   for big projects we can use Interceptors to make it more Nest.JS friendly */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(body);
    response.status(result.code).json(result);
  }

  @Post('login')
  async login(
    @Body() body: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body);
    response.status(result.code).json(result);
  }
}
