import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsObject } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    cartId: string;

    @ApiProperty({ example: 'customer@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsObject()
    shippingAddress: any;

    @ApiProperty()
    @IsObject()
    billingAddress: any;
}
