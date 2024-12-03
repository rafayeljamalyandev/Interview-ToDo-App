import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 25)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 12)
  password: string;
}
