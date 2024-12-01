import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  title: string;
}
