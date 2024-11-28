import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsersService } from './users.service';
// Added to prevent multipart form data processing
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post()
  // Prevent multipart form data processing for better security
  @UseInterceptors(NoFilesInterceptor())
  createUser(@Body() request: CreateUserDto) {
    return this.UsersService.createUser(request);
  }
}
