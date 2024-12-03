import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from 'src/common/dto';
import { paginationDefault } from 'src/common/helpers/pagination';

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
  title: string;

  @IsOptional()
  @IsNumber()
  userId: number;
}
