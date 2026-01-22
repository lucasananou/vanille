import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
