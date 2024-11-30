import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'example@domain.com',
    description: 'A valid email address associated with the user account.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'The user account password, which must be at least 6 characters long.',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
