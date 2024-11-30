import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'The user email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'The user name' })
  @IsString()
  @MaxLength(50)
  name?: string;
}