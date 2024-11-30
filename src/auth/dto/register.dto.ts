import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@domain.com',
    description:
      'A valid email address for the user, used for login and notifications.',
  })
  @IsEmail({}, { message: 'Invalid email address.' })
  email: string;

  @ApiProperty({
    example: 'secureP@ssw0rd',
    description:
      'The password for the user account, must be between 6 and 20 characters.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiPropertyOptional({
    example: 'Jane Smith',
    description: 'Optional full name of the user, up to 50 characters long.',
  })
  @IsString()
  @MaxLength(50)
  name?: string;
}
