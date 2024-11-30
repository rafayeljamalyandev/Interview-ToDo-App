import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'The user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password' })
  @IsString()
  @MinLength(6)
  password: string;
}
