import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiProperty({
    description: 'The new title for the todo',
    example: 'Updated Todo Title',
  })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;
}
