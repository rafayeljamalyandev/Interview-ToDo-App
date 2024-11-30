import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @Length(5, 25)
  email: string;

  @IsString()
  @Length(6, 12)
  password: string;
}
