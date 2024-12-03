import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {

  // @ApiProperty({ example: 'Todo title', description: 'enter a title for the todo' })
  // @IsString()
  // @IsNotEmpty()
  title: string;

  // @ApiProperty({ example: 'Todo description', description: 'enter a description for the todo' })
  // @IsString()
  // @IsNotEmpty()
  description: string;

  // @ApiProperty({ example: 'false', description: 'state of task that would be completed or not' })
  // @IsNotEmpty()
  completed: boolean;

  // @ApiProperty({ example: '22', description: 'the user id' })
  userId: number;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
