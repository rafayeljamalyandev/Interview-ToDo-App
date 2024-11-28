import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsNumber()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}
