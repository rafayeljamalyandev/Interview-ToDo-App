import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Complete project', description: 'The title of the todo' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Need to finish the documentation', description: 'Additional details' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: '2024-03-20T00:00:00.000Z', description: 'The due date of the todo' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
