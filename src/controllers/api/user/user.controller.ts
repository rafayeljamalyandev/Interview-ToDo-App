import { Controller, Get, Param, Post, Body, Put, ValidationPipe } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../../../core/dtos';
import { UserUseCases } from '../../../use-cases/user/user.use-case';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('api/user')
export class UserController {
  constructor(private userUseCases: UserUseCases) {
  }

  @Post('/register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() userDto: CreateUserDto) {
    try {
      let result = await this.userUseCases.register(userDto);
      delete result?.password;
      return {
        status: 200,
        result: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'login a user' })
  @ApiResponse({ status: 200, description: 'get a user token' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(@Body() userLoginDto: UserLoginDto) {
    try {
      let token =await  this.userUseCases.login(userLoginDto);
      return {
        status: 200,
        result: token,
      };
    } catch (error) {
      throw error;
    }
  }

  //------------------------------ Not Implement -------------------------------------------------------------

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
