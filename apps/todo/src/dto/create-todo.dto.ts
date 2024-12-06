import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  title: string;
}
