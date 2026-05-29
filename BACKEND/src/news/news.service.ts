import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsArticleDto, UpdateNewsArticleDto } from './dto/news-article.dto';

function toCreateData(dto: CreateNewsArticleDto): Prisma.NewsArticleCreateInput {
    return {
        ...dto,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        category: dto.category || 'official',
        keyPointsFr: dto.keyPointsFr || [],
        keyPointsEn: dto.keyPointsEn || [],
        paragraphsFr: dto.paragraphsFr || [],
        paragraphsEn: dto.paragraphsEn || [],
    };
}

function toUpdateData(dto: UpdateNewsArticleDto): Prisma.NewsArticleUpdateInput {
    return {
        ...dto,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        category: dto.category || undefined,
        keyPointsFr: dto.keyPointsFr || undefined,
        keyPointsEn: dto.keyPointsEn || undefined,
        paragraphsFr: dto.paragraphsFr || undefined,
        paragraphsEn: dto.paragraphsEn || undefined,
    };
}

@Injectable()
export class NewsService {
    constructor(private readonly prisma: PrismaService) {}

    findPublished() {
        return this.prisma.newsArticle.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' },
        });
    }

    async findPublishedBySlug(slug: string) {
        const article = await this.prisma.newsArticle.findFirst({
            where: { slug, published: true },
        });

        if (!article) {
            throw new NotFoundException('News article not found');
        }

        return article;
    }

    findAllAdmin() {
        return this.prisma.newsArticle.findMany({
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOneAdmin(id: string) {
        const article = await this.prisma.newsArticle.findUnique({ where: { id } });
        if (!article) {
            throw new NotFoundException('News article not found');
        }
        return article;
    }

    create(dto: CreateNewsArticleDto) {
        return this.prisma.newsArticle.create({
            data: toCreateData(dto),
        });
    }

    update(id: string, dto: UpdateNewsArticleDto) {
        return this.prisma.newsArticle.update({
            where: { id },
            data: toUpdateData(dto),
        });
    }

    async remove(id: string) {
        await this.prisma.newsArticle.delete({ where: { id } });
        return { message: 'News article deleted successfully' };
    }
}
