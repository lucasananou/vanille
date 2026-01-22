import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class WishlistService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
    ) { }

    async getWishlist(customerId: string) {
        const items = await this.prisma.wishlistItem.findMany({
            where: { customerId },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        price: true,
                        images: true,
                        stock: true,
                    },
                },
                variant: {
                    select: {
                        id: true,
                        sku: true,
                        price: true,
                        stock: true,
                        options: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { items };
    }

    async addItem(customerId: string, productId: string, variantId?: string) {
        // Verify product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Verify variant if provided
        if (variantId) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: variantId },
            });

            if (!variant || variant.productId !== productId) {
                throw new BadRequestException('Invalid variant for this product');
            }
        }

        // Check if already in wishlist - use findFirst with where to avoid null issues
        const existing = await this.prisma.wishlistItem.findFirst({
            where: {
                customerId,
                productId,
                ...(variantId ? { variantId } : { variantId: null }),
            },
        });

        if (existing) {
            return existing;
        }

        return this.prisma.wishlistItem.create({
            data: {
                customerId,
                productId,
                ...(variantId ? { variantId } : {}),
            },
            include: {
                product: true,
                variant: true,
            },
        });
    }

    async removeItem(wishlistItemId: string, customerId: string) {
        const item = await this.prisma.wishlistItem.findUnique({
            where: { id: wishlistItemId },
        });

        if (!item) {
            throw new NotFoundException('Wishlist item not found');
        }

        if (item.customerId !== customerId) {
            throw new BadRequestException('This item does not belong to you');
        }

        await this.prisma.wishlistItem.delete({
            where: { id: wishlistItemId },
        });

        return { message: 'Item removed from wishlist' };
    }

    async moveToCart(wishlistItemId: string, customerId: string) {
        const wishlistItem = await this.prisma.wishlistItem.findUnique({
            where: { id: wishlistItemId },
            include: {
                product: true,
            },
        });

        if (!wishlistItem) {
            throw new NotFoundException('Wishlist item not found');
        }

        if (wishlistItem.customerId !== customerId) {
            throw new BadRequestException('This item does not belong to you');
        }

        // Get or create cart for customer
        let cart = await this.prisma.cart.findFirst({
            where: { customerId },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { customerId },
            });
        }

        // Add to cart
        await this.cartService.addItem(cart.id, wishlistItem.productId, 1);

        // Remove from wishlist
        await this.prisma.wishlistItem.delete({
            where: { id: wishlistItemId },
        });

        return { message: 'Item moved to cart successfully' };
    }

    async clearWishlist(customerId: string) {
        await this.prisma.wishlistItem.deleteMany({
            where: { customerId },
        });

        return { message: 'Wishlist cleared successfully' };
    }

    async isInWishlist(customerId: string, productId: string, variantId?: string): Promise<boolean> {
        const item = await this.prisma.wishlistItem.findFirst({
            where: {
                customerId,
                productId,
                ...(variantId ? { variantId } : { variantId: null }),
            },
        });

        return !!item;
    }
}
