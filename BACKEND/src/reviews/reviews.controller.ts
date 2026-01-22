import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
    NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CustomerGuard } from '../customer-auth/guards/customer.guard';
import { CreateReviewDto, UpdateReviewDto, ApproveReviewDto } from './dto/review.dto';

@ApiTags('Admin - Reviews')
@ApiBearerAuth()
@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get()
    @ApiOperation({ summary: 'List all reviews' })
    @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'] })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async getAllReviews(
        @Query('status') status?: 'PENDING' | 'APPROVED' | 'REJECTED',
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.reviewsService.getAllReviews(
            status,
            page ? parseInt(page) : undefined,
            limit ? parseInt(limit) : undefined,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get review' })
    async getReview(@Param('id') id: string) {
        return this.reviewsService.getReview(id);
    }

    @Patch(':id/moderate')
    @ApiOperation({ summary: 'Approve or reject review' })
    async moderateReview(
        @Param('id') id: string,
        @Body() approveDto: ApproveReviewDto,
    ) {
        return this.reviewsService.approveReview(id, approveDto.status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete review' })
    async deleteReview(@Param('id') id: string) {
        return this.reviewsService.deleteReview(id);
    }
}

@ApiTags('Store - Reviews')
@Controller('store/products/:productSlug/reviews')
export class StoreReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get()
    @ApiOperation({ summary: 'Get product reviews' })
    async getProductReviews(@Param('productSlug') productSlug: string) {
        return this.reviewsService.getProductReviews(productSlug);
    }

    @Post()
    @ApiOperation({ summary: 'Submit review' })
    @UseGuards(CustomerGuard)
    async submitReview(
        @Param('productSlug') productSlug: string,
        @Body() createDto: CreateReviewDto,
        @Req() req: any,
    ) {
        // Get product ID from slug
        const product = await this.reviewsService['prisma'].product.findUnique({
            where: { slug: productSlug },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.reviewsService.createReview(product.id, req.user.userId, createDto);
    }

    @Post(':reviewId/helpful')
    @ApiOperation({ summary: 'Mark review as helpful' })
    async markHelpful(@Param('reviewId') reviewId: string) {
        return this.reviewsService.markHelpful(reviewId);
    }
}

@ApiTags('Customer - Reviews')
@ApiBearerAuth()
@Controller('customer/reviews')
@UseGuards(CustomerGuard)
export class CustomerReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Patch(':id')
    @ApiOperation({ summary: 'Update own review' })
    async updateReview(
        @Param('id') id: string,
        @Body() updateDto: UpdateReviewDto,
        @Req() req: any,
    ) {
        return this.reviewsService.updateReview(id, req.user.userId, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete own review' })
    async deleteReview(@Param('id') id: string, @Req() req: any) {
        return this.reviewsService.deleteReview(id, req.user.userId);
    }

    @Get('can-review/:productId')
    @ApiOperation({ summary: 'Check if can review product' })
    async canReview(@Param('productId') productId: string, @Req() req: any) {
        const canReview = await this.reviewsService.canReview(productId, req.user.userId);
        return { canReview };
    }
}
