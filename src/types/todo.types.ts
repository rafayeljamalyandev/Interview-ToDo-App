import { IsString, IsBoolean, IsOptional } from 'class-validator';

export interface CreateTodo {
  userId: number;
  title: string;
}
export interface ListTodos {
  userId: number;
}

export class UpdateTodos {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
