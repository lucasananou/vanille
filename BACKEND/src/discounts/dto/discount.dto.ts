import { IsString, IsEnum, IsInt, IsOptional, IsBoolean, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountDto {
    @ApiProperty({ example: 'SUMMER2026' })
    @IsString()
    code: string;

    @ApiProperty({ enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'] })
    @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'])
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

    @ApiProperty({ example: 20, description: 'Percentage (0-100) or fixed amount in cents' })
    @IsInt()
    @Min(0)
    value: number;

    @ApiProperty({ example: 5000, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    minPurchase?: number;

    @ApiProperty({ example: 100, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxUses?: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxUsesPerUser?: number;

    @ApiProperty({ example: '2026-06-01T00:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    startsAt?: string;

    @ApiProperty({ example: '2026-08-31T23:59:59Z', required: false })
    @IsOptional()
    @IsDateString()
    endsAt?: string;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    appliesToCollections?: string[];

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    appliesToProducts?: string[];
}

export class UpdateDiscountDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    value?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    minPurchase?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxUses?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxUsesPerUser?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startsAt?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endsAt?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    appliesToCollections?: string[];

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    appliesToProducts?: string[];
}

export class ApplyDiscountDto {
    @ApiProperty({ example: 'SUMMER2026' })
    @IsString()
    code: string;
}

export class ValidateDiscountDto {
    @ApiProperty({ example: 'SUMMER2026' })
    @IsString()
    code: string;

    @ApiProperty({ example: 10000, description: 'Order subtotal in cents' })
    @IsInt()
    @Min(0)
    subtotal: number;

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    productIds?: string[];

    @ApiProperty({ required: false, type: [String] })
    @IsOptional()
    @IsString({ each: true })
    collectionIds?: string[];
}
