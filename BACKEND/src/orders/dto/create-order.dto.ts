import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsObject, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    cartId?: string;

    @ApiProperty({ example: 'customer@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsObject()
    shippingAddress: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    billingAddress?: any;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsArray()
    items?: any[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    shippingCost?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    shippingRateId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    tax?: number;
}
