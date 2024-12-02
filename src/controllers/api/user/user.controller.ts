import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../../../core/dtos';
import { UserUseCases } from '../../../use-cases/user/user.use-case';

@Controller('api/user')
export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  @Post()
  async register(@Body() userDto: CreateUserDto) {
    let result= await this.userUseCases.register(userDto);
    return {
      status: 200,
      result:result
    };
  }

  @Post()
  login(@Body() userLoginDto: UserLoginDto) {
    let token = this.userUseCases.login(userLoginDto);
    return {
      status: 200,
      result:token,
    };
  }

  //--------------------------------------------------------------------------------------------
  // @Put(':id')
  // updateUser(
  //   @Param('id') userId: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userUseCases.updateUser(userId, updateUserDto);
  // }


  // @Get()
  // async getAllUsers() {
  //   return this.userUseCases.getAllUsers();
  // }


  // @Get(':id')
  // async getUserById(@Param('id') id: any) {
  //   return this.userUseCases.getUserById(id);
  // }
}
