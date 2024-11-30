import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the todo item.',
  })
  id: number;

  @ApiProperty({
    example: 'Plan weekly meeting',
    description: 'A short, descriptive title for the todo item.',
  })
  title: string;

  @ApiProperty({
    example: 'Prepare the agenda and send invites to team members.',
    required: false,
    description: 'Optional detailed description of the todo item.',
  })
  description?: string;

  @ApiProperty({
    example: '2024-12-05T00:00:00.000Z',
    required: false,
    description: 'The deadline for completing the todo item, if applicable.',
  })
  dueDate?: Date;

  @ApiProperty({
    example: '2024-11-30T00:00:00.000Z',
    description: 'The timestamp when the todo item was created.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-11-30T00:00:00.000Z',
    description: 'The timestamp when the todo item was last updated.',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2024-12-01T12:00:00.000Z',
    required: false,
    description: 'The timestamp when the todo item was marked as completed.',
  })
  completedAt?: Date;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user who created the todo item.',
  })
  userId: number;
}
