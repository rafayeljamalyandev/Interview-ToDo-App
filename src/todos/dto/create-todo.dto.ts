import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Go for a walk', description: 'The todo title' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Transform(({ value }) => value?.trim())
  title: string;
}
