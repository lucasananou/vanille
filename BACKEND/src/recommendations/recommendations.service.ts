import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
    constructor(private prisma: PrismaService) { }

    // Get related products based on same collection
    async getRelatedProducts(productId: string, limit = 4) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: {
                collectionId: true,
            },
        });

        if (!product || !product.collectionId) {
            return [];
        }

        return this.prisma.product.findMany({
            where: {
                id: { not: productId },
                published: true,
                collectionId: product.collectionId,
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Get frequently bought together products
    async getFrequentlyBoughtTogether(productId: string, limit = 3) {
        // Find orders that contain this product
        const ordersWithProduct = await this.prisma.orderItem.findMany({
            where: { productId },
            select: { orderId: true },
            distinct: ['orderId'],
        });

        const orderIds = ordersWithProduct.map(o => o.orderId);

        if (orderIds.length === 0) {
            return [];
        }

        // Find other products in those orders
        const otherProducts = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            where: {
                orderId: { in: orderIds },
                productId: { not: productId },
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _count: {
                    productId: 'desc',
                },
            },
            take: limit,
        });

        // Get full product details
        const productIds = otherProducts.map(p => p.productId);
        return this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                published: true,
            },
        });
    }

    // Get personalized recommendations for a customer
    async getPersonalizedRecommendations(customerId: string, limit = 8) {
        // Get customer's purchase history
        const customerOrders = await this.prisma.order.findMany({
            where: { customerId },
            include: { items: true },
        });

        if (customerOrders.length === 0) {
            // No history - return trending/popular products
            return this.getTrendingProducts(limit);
        }

        // Extract collections from purchased products
        const purchasedProductIds = customerOrders
            .flatMap(o => o.items.map(i => i.productId));

        const purchasedProducts = await this.prisma.product.findMany({
            where: { id: { in: purchasedProductIds } },
            select: {
                collectionId: true,
            },
        });

        const collections = [...new Set(purchasedProducts.map(p => p.collectionId).filter(Boolean))];

        if (collections.length === 0) {
            return this.getTrendingProducts(limit);
        }

        // Find products in same collections that customer hasn't bought
        return this.prisma.product.findMany({
            where: {
                id: { notIn: purchasedProductIds },
                published: true,
                collectionId: { in: collections as string[] },
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Get trending/popular products
    async getTrendingProducts(limit = 8) {
        // Get products ordered most in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const popularProducts = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            where: {
                order: {
                    createdAt: { gte: thirtyDaysAgo },
                },
            },
            _count: {
                productId: true,
            },
            orderBy: {
                _count: {
                    productId: 'desc',
                },
            },
            take: limit,
        });

        const productIds = popularProducts.map(p => p.productId);
        return this.prisma.product.findMany({
            where: {
                id: { in: productIds },
                published: true,
            },
        });
    }

    // Get new arrivals
    async getNewArrivals(limit = 8) {
        return this.prisma.product.findMany({
            where: { published: true },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // Get products similar to those in cart
    async getCartRecommendations(cartId: string, limit = 4) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                collectionId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return this.getTrendingProducts(limit);
        }

        const collections = [...new Set(cart.items.map(i => i.product.collectionId).filter(Boolean))];
        const cartProductIds = cart.items.map(i => i.productId);

        if (collections.length === 0) {
            return this.getTrendingProducts(limit);
        }

        return this.prisma.product.findMany({
            where: {
                id: { notIn: cartProductIds },
                published: true,
                collectionId: { in: collections as string[] },
            },
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
