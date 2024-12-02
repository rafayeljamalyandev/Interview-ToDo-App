import { Injectable } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import { CreateUserDto, UpdateUserDto, UserLoginDto } from '../../core/dtos';
import { UserFactoryService } from './user-factory.service';
import { User } from '../../core';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserNotFoundException } from '../../core/exceptions/user-not-found-exception';

@Injectable()
export class UserUseCases {
  constructor(
    private dataServices: IDataServices,
    private userFactoryService: UserFactoryService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userFactoryService.createNewUser(createUserDto);
    return this.dataServices.user.register(user);
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    let user = await this.dataServices.user.login(
      userLoginDto.email,
      userLoginDto.password,
    );
    if (
      !user ||
      !(await bcrypt.compare(userLoginDto.password, user.password))
    ) {
      throw new UserNotFoundException();
    }
    return jwt.sign({ userId: user.id }, 'some_secret_key');
  }

  //-------------------------------------------------------------------------------------------

  // updateUser(
  //   userId: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<User> {
  //   const user = this.userFactoryService.updateUser(updateUserDto);
  //   return this.dataServices.user.update(userId, user);
  // }

  // getAllUsers(): Promise<User[]> {
  //   return this.dataServices.user.getAll();
  // }

  // getUserById(id: any): Promise<User> {
  //   return this.dataServices.user.get(id);
  // }
}
