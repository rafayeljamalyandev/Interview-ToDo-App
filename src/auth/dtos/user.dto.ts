import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;
}
