import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCartDto {
    @ApiPropertyOptional({ example: 'guest-session-uuid' })
    @IsString()
    @IsOptional()
    sessionId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    userId?: string;
}
