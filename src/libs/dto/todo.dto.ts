import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ description: 'The title of the TODO item' })
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'The title of the TODO item',
    required: false,
    example: 'Buy groceries',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The completion status of the TODO item',
    default: false,
  })
  @IsOptional()
  completed?: boolean;
}
