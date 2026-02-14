import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsNotEmpty()
  branch_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  total_amount: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  payment_method: string;

  @IsDateString()
  @IsOptional()
  created_at?: string;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  branch_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items?: OrderItemDto[];

  @IsNumber()
  @IsOptional()
  total_amount?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsDateString()
  @IsOptional()
  created_at?: string;
}
