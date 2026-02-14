import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';

export enum ItemType {
    INGREDIENT = 'INGREDIENT',
    PRODUCT = 'PRODUCT',
}

export class CreateInventoryItemDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(ItemType)
    type: ItemType;

    @IsNumber()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsDateString()
    @IsOptional()
    expiry_date?: string;

    @IsString()
    @IsNotEmpty()
    branch_id: string;

    @IsNumber()
    @IsOptional()
    low_stock_threshold?: number;

    @IsString()
    @IsOptional()
    vendor?: string;
}

export class UpdateInventoryItemDto extends CreateInventoryItemDto { }
