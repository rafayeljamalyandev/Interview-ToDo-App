import { Controller, Post, Body } from '@nestjs/common';
import { AuthServiceV1 } from './auth.service-v1';
import { ReqRegisterDTO } from './dto/request.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthControllerV1 {
  constructor(private authService: AuthServiceV1) {}

  // @Post('register')
  // async register(@Body() body: { email: string; password: string }) {
  //   return this.authService.register(body.email, body.password);
  // }

  @Post('register')
  async register(@Body() body: ReqRegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // return this.authService.login(body.email, body.password);
    return 'asd';
  }
}
