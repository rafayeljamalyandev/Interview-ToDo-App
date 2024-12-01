import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo',
    example: 'Complete NestJS tutorial',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateTodoDto {
  @ApiPropertyOptional({
    description: 'The new title of the todo',
    example: 'Learn NestJS and Swagger integration',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Mark the todo as completed or not',
    example: true,
  })
  @IsOptional()
  completed?: boolean;
}