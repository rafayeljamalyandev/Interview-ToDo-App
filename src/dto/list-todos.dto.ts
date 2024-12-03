import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ListTodosDto {
  @IsInt()
  @IsOptional() // Allow userId to be optional here, as it will be set in the controller
  userId?: number; // Made userId optional for validation
}