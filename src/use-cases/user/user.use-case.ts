import { Injectable } from '@nestjs/common';
import { IDataServices } from '../../core/abstracts';
import {   CreateUserDto, UpdateUserDto } from '../../core/dtos';
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

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userFactoryService.createNewUser(createUserDto);
    return this.dataServices.user.create(user);
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = this.userFactoryService.updateUser(updateUserDto);
    return this.dataServices.user.update(userId, user);
  }


}
