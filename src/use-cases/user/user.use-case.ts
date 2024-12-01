import { Injectable } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import { CreateUserDto,   UpdateUserDto, UserLoginDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';
import {  User } from '../../core';

@Injectable()
export class UserUseCases {
  constructor(
    private dataServices: IDataServices,
    private userFactoryService: UserFactoryService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.dataServices.user.getAll();
  }

  getUserById(id: any): Promise<User> {
    return this.dataServices.user.get(id);
  }

  register(createUserDto: CreateUserDto):  void  {
    const user = this.userFactoryService.createNewUser(createUserDto);
    this.dataServices.user.register(user);
  }

  login(userLoginDto: UserLoginDto): Promise<string> {
    return this.dataServices.user.login(userLoginDto.email, userLoginDto.password);
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = this.userFactoryService.updateUser(updateUserDto);
    return this.dataServices.user.update(userId, user);
  }


}
