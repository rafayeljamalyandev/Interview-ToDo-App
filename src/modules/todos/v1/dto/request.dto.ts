import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from '../../.././../common/dto/pagination.dto';

export class ReqCreateTodoDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  userId: number;
}

export class ReqGetListTodoDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
