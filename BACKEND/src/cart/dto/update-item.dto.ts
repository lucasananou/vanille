import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateItemDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(0)
    quantity: number;
}
