import { Controller, Post, Body } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service-v1';
import { ReqLoginDTO, ReqRegisterDTO } from './dto/request.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(private authService: AuthServiceV1) {}

  @Post('register')
  async register(@Body() body: ReqRegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: ReqLoginDTO) {
    return this.authService.login(body);
  }
}
