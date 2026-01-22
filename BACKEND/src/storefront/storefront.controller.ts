import {
    Controller,
    Get,
    Param,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StorefrontService } from './storefront.service';

@ApiTags('Storefront')
@Controller('store')
export class StorefrontController {
    constructor(private readonly storefrontService: StorefrontService) { }

    @Get('products')
    @ApiOperation({ summary: 'Get published products (public)' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    @ApiQuery({ name: 'collection', required: false, type: String })
    @ApiQuery({ name: 'tags', required: false, type: String, description: 'Comma-separated tags' })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    @ApiQuery({ name: 'sort', required: false, enum: ['price_asc', 'price_desc', 'newest', 'title'] })
    getProducts(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(24), ParseIntPipe) take: number,
        @Query('collection') collectionSlug?: string,
        @Query('tags') tagsString?: string,
        @Query('minPrice', new DefaultValuePipe(undefined)) minPrice?: number,
        @Query('maxPrice', new DefaultValuePipe(undefined)) maxPrice?: number,
        @Query('sort') sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'title',
    ) {
        const tags = tagsString ? tagsString.split(',') : undefined;
        return this.storefrontService.getProducts({
            skip,
            take,
            collectionSlug,
            tags,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            sortBy,
        });
    }

    @Get('products/:slug')
    @ApiOperation({ summary: 'Get product by slug (public)' })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    getProductBySlug(@Param('slug') slug: string) {
        return this.storefrontService.getProductBySlug(slug);
    }

    @Get('collections')
    @ApiOperation({ summary: 'Get all collections (public)' })
    getCollections() {
        return this.storefrontService.getCollections();
    }

    @Get('collections/:slug')
    @ApiOperation({ summary: 'Get collection by slug (public)' })
    @ApiResponse({ status: 200, description: 'Collection found' })
    @ApiResponse({ status: 404, description: 'Collection not found' })
    getCollectionBySlug(@Param('slug') slug: string) {
        return this.storefrontService.getCollectionBySlug(slug);
    }

    @Get('collections/:slug/products')
    @ApiOperation({ summary: 'Get products in a collection (public)' })
    @ApiQuery({ name: 'skip', required: false, type: Number })
    @ApiQuery({ name: 'take', required: false, type: Number })
    getCollectionProducts(
        @Param('slug') slug: string,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(24), ParseIntPipe) take: number,
    ) {
        return this.storefrontService.getCollectionProducts(slug, skip, take);
    }
}
