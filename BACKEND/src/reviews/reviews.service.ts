import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(productId: string, customerId: string, createDto: CreateReviewDto) {
        // Verify product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if already reviewed
        const existingReview = await this.prisma.review.findFirst({
            where: {
                productId,
                customerId,
            },
        });

        if (existingReview) {
            throw new BadRequestException('You have already reviewed this product');
        }

        // Check verified purchase if orderId provided
        let verifiedPurchase = false;
        if (createDto.orderId) {
            const order = await this.prisma.order.findFirst({
                where: {
                    id: createDto.orderId,
                    customerId,
                    status: 'PAID',
                    items: {
                        some: {
                            productId,
                        },
                    },
                },
            });

            verifiedPurchase = !!order;
        }

        return this.prisma.review.create({
            data: {
                productId,
                customerId,
                orderId: createDto.orderId,
                rating: createDto.rating,
                title: createDto.title,
                comment: createDto.comment,
                verifiedPurchase,
            },
            include: {
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async getProductReviews(productSlug: string, status: 'APPROVED' | 'all' = 'APPROVED') {
        // Get product by slug
        const product = await this.prisma.product.findUnique({
            where: { slug: productSlug },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const where: any = {
            productId: product.id,
        };

        if (status === 'APPROVED') {
            where.status = 'APPROVED';
        }

        const reviews = await this.prisma.review.findMany({
            where,
            include: {
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return {
            reviews,
            stats: {
                totalReviews: reviews.length,
                averageRating: Math.round(avgRating * 10) / 10,
                ratingDistribution: this.getRatingDistribution(reviews),
            },
        };
    }

    async canReview(productId: string, customerId: string): Promise<boolean> {
        // Check if already reviewed
        const existingReview = await this.prisma.review.findFirst({
            where: {
                productId,
                customerId,
            },
        });

        if (existingReview) {
            return false;
        }

        // Check if purchased
        const order = await this.prisma.order.findFirst({
            where: {
                customerId,
                status: 'PAID',
                items: {
                    some: {
                        productId,
                    },
                },
            },
        });

        return !!order;
    }

    async markHelpful(reviewId: string) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.prisma.review.update({
            where: { id: reviewId },
            data: {
                helpfulCount: {
                    increment: 1,
                },
            },
        });
    }

    // ADMIN METHODS
    async getAllReviews(status?: 'PENDING' | 'APPROVED' | 'REJECTED', page = 1, limit = 20) {
        const where: any = {};
        if (status) {
            where.status = status;
        }

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where,
                skip,
                take: limit,
                include: {
                    product: {
                        select: {
                            title: true,
                            slug: true,
                        },
                    },
                    customer: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.review.count({ where }),
        ]);

        return {
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getReview(id: string) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: {
                product: true,
                customer: true,
            },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return review;
    }

    async approveReview(id: string, status: 'APPROVED' | 'REJECTED') {
        await this.getReview(id);

        return this.prisma.review.update({
            where: { id },
            data: { status },
        });
    }

    async deleteReview(id: string, customerId?: string) {
        const review = await this.getReview(id);

        // If customerId provided, verify ownership
        if (customerId && review.customerId !== customerId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.prisma.review.delete({
            where: { id },
        });

        return { message: 'Review deleted successfully' };
    }

    async updateReview(id: string, customerId: string, updateDto: UpdateReviewDto) {
        const review = await this.getReview(id);

        if (review.customerId !== customerId) {
            throw new ForbiddenException('You can only update your own reviews');
        }

        return this.prisma.review.update({
            where: { id },
            data: updateDto,
        });
    }

    private getRatingDistribution(reviews: any[]) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            distribution[review.rating] = (distribution[review.rating] || 0) + 1;
        });
        return distribution;
    }
}
