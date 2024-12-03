import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTodoDto {

  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsOptional() // Allow userId to be optional here, as it will be set in the controller
  userId?: number; // Made userId optional for validation
}