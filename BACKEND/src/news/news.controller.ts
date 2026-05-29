import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { NewsService } from './news.service';
import { CreateNewsArticleDto, UpdateNewsArticleDto } from './dto/news-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Storefront - News')
@Controller('store/news')
export class PublicNewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    @ApiOperation({ summary: 'Get published news articles' })
    findPublished() {
        return this.newsService.findPublished();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get published news article by slug' })
    findBySlug(@Param('slug') slug: string) {
        return this.newsService.findPublishedBySlug(slug);
    }
}

@ApiTags('Admin - News')
@ApiBearerAuth()
@Controller('admin/news')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class AdminNewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all news articles (admin)' })
    findAll() {
        return this.newsService.findAllAdmin();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get news article by ID (admin)' })
    findOne(@Param('id') id: string) {
        return this.newsService.findOneAdmin(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create news article' })
    create(@Body() dto: CreateNewsArticleDto) {
        return this.newsService.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update news article' })
    update(@Param('id') id: string, @Body() dto: UpdateNewsArticleDto) {
        return this.newsService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete news article' })
    remove(@Param('id') id: string) {
        return this.newsService.remove(id);
    }
}
