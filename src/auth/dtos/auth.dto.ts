import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @Length(5, 200)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;
}
