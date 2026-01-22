import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ example: 'Great product!', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: 'I loved this product, highly recommend it!' })
    @IsString()
    comment: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    orderId?: string;
}

export class UpdateReviewDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    comment?: string;
}

export class ApproveReviewDto {
    @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
    @IsString()
    status: 'APPROVED' | 'REJECTED';
}
