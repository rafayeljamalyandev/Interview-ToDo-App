import { IsString, IsNotEmpty, isEmail, Length, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jimi', description: 'name of user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'email@demo.com', description: 'the email address' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'the password of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserLoginDto {
  @ApiProperty({ example: 'John@demo.com', description: 'the email address' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'the password of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;
}