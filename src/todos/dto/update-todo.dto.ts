import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateTodoDto {
  @ApiPropertyOptional({
    example: 'Prepare for quarterly review meeting',
    description: 'The updated title of the todo item. Must not exceed 255 characters.',
    maxLength: 255,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsOptional()
  @MaxLength(255, { message: 'Title cannot exceed 255 characters.' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Compile all project reports and create presentation slides.',
    description: 'Optional updated description providing additional details about the todo.',
  })
  @IsString({ message: 'Description must be a string.' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '2024-12-05T00:00:00.000Z',
    description: 'The deadline for completing the todo item (optional).',
  })
  @ValidateIf((object, value) => value !== undefined) // Ensures the field is optional
  @IsDateString({}, { message: 'Due date must be a valid ISO 8601 date string.' })
  @IsOptional()
  dueDate?: string;
}
