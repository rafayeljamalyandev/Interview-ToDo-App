import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseResponseDto<T, R, P> {
  @ApiProperty({
    description: 'The status code of the response ',
    example: 200,
  })
  readonly status: T;

  @ApiProperty({
    description:
      'A message providing additional information about the response',
    example: 'Operation completed successfully',
  })
  readonly message: R;

  @ApiProperty({
    description: 'The actual data returned in the response',
    example: {},
  })
  @IsOptional()
  readonly data?: P | P[];
}
