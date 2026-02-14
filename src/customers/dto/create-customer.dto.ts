import { IsString, IsNotEmpty, IsOptional, IsEmail, IsPhoneNumber, IsNumber } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsOptional()
    preferences?: any;
}

export class UpdateCustomerDto extends CreateCustomerDto {
    @IsNumber()
    @IsOptional()
    loyalty_points?: number;
}
