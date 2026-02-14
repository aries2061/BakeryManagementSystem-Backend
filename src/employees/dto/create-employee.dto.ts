import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import type { JsonObject } from '../../common/types/json-value.type';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  branch_id: string;

  @IsNumber()
  @IsNotEmpty()
  hourly_rate: number;

  @IsOptional()
  schedule?: JsonObject;

  @IsDateString()
  @IsOptional()
  hired_date?: string;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  branch_id?: string;

  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @IsOptional()
  schedule?: JsonObject;

  @IsDateString()
  @IsOptional()
  hired_date?: string;
}
