import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaxRateDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ required: false, example: 'CA' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiProperty({ example: 0.0875, description: 'Tax rate as decimal (e.g., 0.0875 for 8.75%)' })
    @IsNumber()
    @Min(0)
    @Max(1)
    rate: number;

    @ApiProperty({ example: 'Sales Tax' })
    @IsString()
    name: string;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class UpdateTaxRateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    rate?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class CalculateTaxDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ required: false, example: 'CA' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiProperty({ example: 10000, description: 'Subtotal in cents' })
    @IsNumber()
    @Min(0)
    subtotal: number;
}
