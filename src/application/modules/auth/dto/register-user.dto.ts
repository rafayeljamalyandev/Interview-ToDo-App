import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 25)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
