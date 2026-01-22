import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsInt,
    IsOptional,
    IsBoolean,
    IsArray,
    Min,
    MinLength,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'Premium Wireless Headphones' })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiPropertyOptional({ example: 'High-quality noise-cancelling headphones' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'WHP-001' })
    @IsString()
    sku: string;

    @ApiPropertyOptional({ example: 'premium-wireless-headphones' })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 29999, description: 'Price in cents' })
    @IsInt()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ example: 39999, description: 'Compare at price in cents' })
    @IsInt()
    @Min(0)
    @IsOptional()
    compareAtPrice?: number;

    @ApiProperty({ example: 50 })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({ example: ['https://example.com/image.jpg'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @ApiPropertyOptional({ example: ['electronics', 'audio'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    published?: boolean;

    @ApiPropertyOptional({ example: 'Premium Wireless Headphones - Best Audio' })
    @IsString()
    @IsOptional()
    seoTitle?: string;

    @ApiPropertyOptional({ example: 'Experience superior sound quality...' })
    @IsString()
    @IsOptional()
    seoMetaDescription?: string;

    @ApiPropertyOptional({ example: 'clxxx...' })
    @IsString()
    @IsOptional()
    collectionId?: string;

    @ApiPropertyOptional({ type: () => [ProductOptionDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionDto)
    @IsOptional()
    options?: ProductOptionDto[];

    @ApiPropertyOptional({ type: () => [ProductVariantDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    @IsOptional()
    variants?: ProductVariantDto[];
}

export class ProductOptionDto {
    @ApiProperty({ example: 'Size' })
    @IsString()
    name: string;

    @ApiProperty({ example: ['S', 'M', 'L'] })
    @IsArray()
    @IsString({ each: true })
    values: string[];

    @ApiPropertyOptional({ example: 0 })
    @IsInt()
    @IsOptional()
    position?: number;
}

export class ProductVariantDto {
    @ApiProperty({ example: 'Small / Red' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'WHP-001-S-R' })
    @IsString()
    sku: string;

    @ApiPropertyOptional({ example: 29999 })
    @IsInt()
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({ example: 39999 })
    @IsInt()
    @IsOptional()
    compareAtPrice?: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({ example: 'https://example.com/variant.jpg' })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({ example: { size: 'S', color: 'Red' } })
    @IsObject()
    options: Record<string, string>;
}
