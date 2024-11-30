import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  // Añade esto
  getProfile(@GetUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')  // Añade esto
  updateProfile(@GetUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  // Añade esto
  getTodoStats(@GetUser() user: any) {
    return this.usersService.getTodoStats(user.id);
  }
}
