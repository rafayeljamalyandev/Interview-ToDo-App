import { Controller, Post, Body, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService) {}

@Post('register')
async register(@Body() RegisterDto:RegisterDto){
  try{
    const user = await this.authService.register(
      RegisterDto.email,
      RegisterDto.password
    )
    return {message:'User registered successfully', user};
  }catch(error){

    throw error;
  }
 
}

@Post('login')
async login(@Body() LoginDto:LoginDto){
  try{
    const token = await this.authService.login(
      LoginDto.email,
      LoginDto.password
    )
    return {message:"login successful",...token}
  }catch(error){
    throw error;
  }
}


@Post('profile')
@UseGuards(JwtAuthGuard)
async profile(@Request() req){
  return req.user
}
}