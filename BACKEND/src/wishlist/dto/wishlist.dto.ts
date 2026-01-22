import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
    @ApiProperty({ example: 'product-id' })
    @IsString()
    productId: string;

    @ApiProperty({ required: false, example: 'variant-id' })
    @IsOptional()
    @IsString()
    variantId?: string;
}
