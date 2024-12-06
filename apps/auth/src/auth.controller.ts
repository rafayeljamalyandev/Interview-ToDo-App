import { JwtGuard } from '../../../libs/common/src/common/guards/jwt.guard';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDTO } from './dto/refresh.dto';
import { AuthorizedRequest } from "@app/common/common/types/authorized-request.type";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: AuthorizedRequest, @Body() dto: RefreshDTO) {
    const userId = req.user['id'];
    const refreshToken = dto.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
