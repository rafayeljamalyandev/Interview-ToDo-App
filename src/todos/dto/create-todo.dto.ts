import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, MinLength, ValidateIf, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Plan team meeting',
    description: 'A brief title for the todo item.',
  })
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  @MaxLength(255, { message: 'Title cannot exceed 255 characters.' })
  title: string;

  @ApiPropertyOptional({
    example: 'Prepare an agenda for the weekly team meeting.',
    description: 'Optional detailed description of the todo.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-05T00:00:00.000Z',
    description: 'The deadline for completing the todo item (optional).',
  })
  @ValidateIf((_object, value) => value !== undefined) // Ensures the field is optional
  @IsDateString({}, { message: 'Due date must be a valid ISO 8601 date string.' })
  @IsOptional()
  dueDate?: string;
}
