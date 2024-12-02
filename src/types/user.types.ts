import { IsString, IsEmail, Length } from 'class-validator';

export class RegisterUser {
  @IsEmail()
  @Length(6, 50)
  email: string;

  @IsString()
  @Length(6, 12)
  password: string;
}

export class LoginUser {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
