import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Complete Project' })
  title: string;

  @ApiProperty({ example: 'Finish the documentation', required: false })
  description?: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2024-03-20T00:00:00.000Z', required: false })
  dueDate?: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z', required: false })
  completedAt?: Date;

  @ApiProperty({ example: 1 })
  userId: number;
}
