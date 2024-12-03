import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReqCreateTodoDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
