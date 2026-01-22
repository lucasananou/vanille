import { IsString, IsInt, IsOptional, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductOptionDto {
    @ApiProperty({ example: 'Size' })
    @IsString()
    name: string;

    @ApiProperty({ example: ['S', 'M', 'L', 'XL'] })
    @IsString({ each: true })
    values: string[];

    @ApiProperty({ example: 0, required: false })
    @IsOptional()
    @IsInt()
    position?: number;
}

export class UpdateProductOptionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString({ each: true })
    values?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    position?: number;
}

export class CreateVariantDto {
    @ApiProperty({ example: 'PRD-VAR-001' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 'Small / Red' })
    @IsString()
    title: string;

    @ApiProperty({ example: { size: 'S', color: 'Red' } })
    @IsObject()
    options: Record<string, string>;

    @ApiProperty({ example: 2999, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty({ example: 3999, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    compareAtPrice?: number;

    @ApiProperty({ example: 50 })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 'https://...', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ default: true })
    @IsOptional()
    @IsBoolean()
    published?: boolean;
}

export class UpdateVariantDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    options?: Record<string, string>;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    compareAtPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    published?: boolean;
}

export class GenerateVariantsDto {
    @ApiProperty({ description: 'Auto-generate all combinations from product options' })
    @IsOptional()
    @IsBoolean()
    clearExisting?: boolean;
}
