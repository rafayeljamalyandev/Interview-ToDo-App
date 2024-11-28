import { IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  // Validates email format using class-validator
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  // Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  password: string;
}
