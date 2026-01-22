import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Store - Recommendations')
@Controller('store/recommendations')
export class RecommendationsController {
    constructor(private recommendationsService: RecommendationsService) { }

    @Get('related/:productId')
    @ApiOperation({ summary: 'Get related products' })
    @ApiQuery({ name: 'limit', required: false })
    async getRelated(
        @Param('productId') productId: string,
        @Query('limit') limit?: string,
    ) {
        return this.recommendationsService.getRelatedProducts(
            productId,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('frequently-bought-together/:productId')
    @ApiOperation({ summary: 'Get frequently bought together products' })
    @ApiQuery({ name: 'limit', required: false })
    async getFrequentlyBought(
        @Param('productId') productId: string,
        @Query('limit') limit?: string,
    ) {
        return this.recommendationsService.getFrequentlyBoughtTogether(
            productId,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('personalized/:customerId')
    @ApiOperation({ summary: 'Get personalized recommendations' })
    @ApiQuery({ name: 'limit', required: false })
    async getPersonalized(
        @Param('customerId') customerId: string,
        @Query('limit') limit?: string,
    ) {
        return this.recommendationsService.getPersonalizedRecommendations(
            customerId,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending products' })
    @ApiQuery({ name: 'limit', required: false })
    async getTrending(@Query('limit') limit?: string) {
        return this.recommendationsService.getTrendingProducts(
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('new-arrivals')
    @ApiOperation({ summary: 'Get new arrivals' })
    @ApiQuery({ name: 'limit', required: false })
    async getNewArrivals(@Query('limit') limit?: string) {
        return this.recommendationsService.getNewArrivals(
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get('cart/:cartId')
    @ApiOperation({ summary: 'Get recommendations based on cart' })
    @ApiQuery({ name: 'limit', required: false })
    async getCartRecommendations(
        @Param('cartId') cartId: string,
        @Query('limit') limit?: string,
    ) {
        return this.recommendationsService.getCartRecommendations(
            cartId,
            limit ? parseInt(limit) : undefined,
        );
    }
}
