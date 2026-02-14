import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

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
    schedule?: any; // JSON object for schedule

    @IsDateString()
    @IsOptional()
    hired_date?: string;
}

export class UpdateEmployeeDto extends CreateEmployeeDto { }
