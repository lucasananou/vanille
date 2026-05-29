import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateNewsArticleDto {
    @ApiProperty()
    @IsString()
    slug: string;

    @ApiPropertyOptional({ default: 'official' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coverImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    documentUrl?: string;

    @ApiProperty()
    @IsString()
    sourceName: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    published?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    publishedAt?: string;

    @ApiProperty()
    @IsString()
    titleFr: string;

    @ApiProperty()
    @IsString()
    titleEn: string;

    @ApiProperty()
    @IsString()
    excerptFr: string;

    @ApiProperty()
    @IsString()
    excerptEn: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryLabelFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categoryLabelEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readTimeFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    readTimeEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    heroEyebrowFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    heroEyebrowEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sourceLabelFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sourceLabelEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    pdfLabelFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    pdfLabelEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    keyPointsTitleFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    keyPointsTitleEn?: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    keyPointsFr: string[];

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    keyPointsEn: string[];

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    paragraphsFr: string[];

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    paragraphsEn: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ctaTitleFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ctaTitleEn?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ctaTextFr?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ctaTextEn?: string;
}

export class UpdateNewsArticleDto extends PartialType(CreateNewsArticleDto) {}
