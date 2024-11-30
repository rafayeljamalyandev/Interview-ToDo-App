import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({
    example: 'Complete NestJS Project',
    description: 'The updated title of the todo',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: 'Need to finish the API documentation and testing',
    description: 'The updated description of the todo',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'The completion status of the todo',
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({
    example: '2024-03-20T00:00:00.000Z',
    description: 'The updated due date of the todo (ISO 8601 format)',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}