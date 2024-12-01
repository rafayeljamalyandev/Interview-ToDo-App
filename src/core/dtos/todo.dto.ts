import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  completed: boolean;

  userId: number;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
