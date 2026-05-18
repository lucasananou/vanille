import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'ancienMotDePasse' })
    @IsString()
    @MinLength(1)
    currentPassword: string;

    @ApiProperty({ example: 'nouveauMotDePasseSecurise' })
    @IsString()
    @MinLength(8)
    newPassword: string;
}
