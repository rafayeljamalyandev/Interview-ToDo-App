import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 25)
  title: string;

  userId: number;
}
