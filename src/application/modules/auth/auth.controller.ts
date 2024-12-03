import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Tokens } from './types';
import { RtGuard } from '../../../common/guards';
import { GetCurrentUserId, Public } from '../../../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto): Promise<Tokens> {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) resp,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<Tokens> {
    return this.authService.login(loginUserDto, resp);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res({ passthrough: true }) resp,
    @GetCurrentUserId() userId: number,
  ) {
    console.log({ userId });
    return this.authService.refreshTokens(userId, resp);
  }
}
