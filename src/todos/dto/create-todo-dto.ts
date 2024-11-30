import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength
} from "class-validator";

export class CreateTodoDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(120)
    title: string;
}