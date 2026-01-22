import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRefundDto {
    @ApiProperty({ example: 5000, description: 'Amount to refund in cents' })
    @IsInt()
    @Min(1)
    amount: number;

    @ApiProperty({ example: 'Customer requested refund - item defective' })
    @IsString()
    reason: string;
}

export class ProcessRefundDto {
    @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
    @IsString()
    status: 'APPROVED' | 'REJECTED';

    @ApiProperty({ required: false, example: 'Refund approved and processed via payment gateway' })
    @IsOptional()
    @IsString()
    notes?: string;
}
