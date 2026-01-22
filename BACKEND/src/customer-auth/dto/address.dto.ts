import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty({ enum: ['SHIPPING', 'BILLING'] })
    @IsEnum(['SHIPPING', 'BILLING'])
    type: 'SHIPPING' | 'BILLING';

    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: 'Acme Corp', required: false })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({ example: '123 Main St' })
    @IsString()
    address1: string;

    @ApiProperty({ example: 'Apt 4B', required: false })
    @IsOptional()
    @IsString()
    address2?: string;

    @ApiProperty({ example: 'New York' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'NY', required: false })
    @IsOptional()
    @IsString()
    province?: string;

    @ApiProperty({ example: '10001' })
    @IsString()
    postalCode: string;

    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateAddressDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address1?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address2?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    province?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
