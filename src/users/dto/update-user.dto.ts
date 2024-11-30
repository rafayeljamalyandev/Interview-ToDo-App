import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'newmail@example.com',
    description: 'The email address to update to',
    format: 'email'
  })
  @IsEmail({}, {
    message: 'Please provide a valid email address'
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'NewPass123!',
    description: 'New password (6-20 characters, must include at least one number)',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long'
  })
  @MaxLength(20, {
    message: 'Password cannot be longer than 20 characters'
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name to update to (max 50 characters)',
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  @MaxLength(50, {
    message: 'Name cannot be longer than 50 characters'
  })
  name?: string;
}