import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    BOGO = 'BOGO',
}

export class CreatePromotionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(DiscountType)
    discount_type: DiscountType;

    @IsNumber()
    discount_value: number;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsString()
    @IsOptional()
    branch_id?: string;

    @IsString()
    @IsOptional()
    product_id?: string;

    @IsNumber()
    @IsOptional()
    min_order_amount?: number;
}

export class UpdatePromotionDto extends CreatePromotionDto { }
