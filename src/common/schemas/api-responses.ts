import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      name: 'John Doe'
    }
  })
  user: any;
}

export class TodoResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Complete Project' })
  title: string;

  @ApiProperty({ example: 'Finish the documentation and testing' })
  description?: string;

  @ApiProperty({ example: false })
  completed: boolean;

  @ApiProperty({ example: '2024-03-20T00:00:00.000Z' })
  dueDate?: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z' })
  updatedAt: Date;
}

export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 'Email already exists' })
  message: string;
} 