import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TodoState } from '../entities/enums/todo-state.enum.dto';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  priority: number;

  state: TodoState;

  userId: number;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
