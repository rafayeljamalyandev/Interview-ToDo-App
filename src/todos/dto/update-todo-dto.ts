import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength
} from "class-validator";

export class UpdateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  title?: string;
  completed?: boolean;
}
  