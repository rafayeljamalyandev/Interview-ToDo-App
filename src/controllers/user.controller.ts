import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../core/dtos';
import { UserUseCases } from '../use-cases/user/user.use-case';

@Controller('api/user')
export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  @Get()
  async getAllUsers() {
    return this.userUseCases.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: any) {
    return this.userUseCases.getUserById(id);
  }

  @Post()
  async register(@Body() userDto: CreateUserDto) {
      await this.userUseCases.register(userDto);
  }

  @Post()
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userUseCases.login(userLoginDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userUseCases.updateUser(userId, updateUserDto);
  }
}
