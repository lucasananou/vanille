import { IsString, IsInt, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShippingZoneDto {
    @ApiProperty({ example: 'North America' })
    @IsString()
    name: string;

    @ApiProperty({ example: ['US', 'CA', 'MX'] })
    @IsArray()
    @IsString({ each: true })
    countries: string[];

    @ApiProperty({ required: false, example: ['NY', 'CA', 'TX'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    regions?: string[];

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class UpdateShippingZoneDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    countries?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    regions?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class CreateShippingRateDto {
    @ApiProperty({ example: 'Standard Shipping' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1000, description: 'Price in cents' })
    @IsInt()
    @Min(0)
    price: number;

    @ApiProperty({ required: false, example: 5000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    minOrderValue?: number;

    @ApiProperty({ required: false, example: 50000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    maxOrderValue?: number;

    @ApiProperty({ required: false, example: '3-5 business days' })
    @IsOptional()
    @IsString()
    estimatedDays?: string;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class UpdateShippingRateDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    minOrderValue?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    maxOrderValue?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    estimatedDays?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class CalculateShippingDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ required: false, example: 'NY' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiProperty({ example: 10000 })
    @IsInt()
    @Min(0)
    orderValue: number;
}
