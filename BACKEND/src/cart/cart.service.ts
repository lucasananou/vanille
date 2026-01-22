import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async createCart(sessionId?: string, userId?: string) {
        return this.prisma.cart.create({
            data: {
                sessionId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async getCart(cartId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                images: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Calculate total
        const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
            ...cart,
            subtotal,
        };
    }

    async addItem(cartId: string, productId: string, quantity: number) {
        // Check if cart exists
        const cart = await this.prisma.cart.findUnique({ where: { id: cartId } });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        // Check if product exists and has stock
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // Check if item already exists in cart (with same product, no variant for now)
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId,
                productId,
                variantId: null,
            },
        });

        if (existingItem) {
            // Update quantity
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
        } else {
            // Create new cart item
            await this.prisma.cartItem.create({
                data: {
                    cartId,
                    productId,
                    quantity,
                    price: product.price,
                },
            });
        }

        // Update cart lastUpdatedAt
        await this.prisma.cart.update({
            where: { id: cartId },
            data: {
                lastUpdatedAt: new Date(),
            },
        });

        return this.getCart(cartId);
    }

    async updateItemQuantity(cartId: string, itemId: string, quantity: number) {
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId,
            },
            include: {
                product: true,
            },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        if (item.product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await this.prisma.cartItem.delete({
                where: { id: itemId },
            });
        } else {
            // Update quantity
            await this.prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            });
        }

        // Update cart lastUpdatedAt
        await this.prisma.cart.update({
            where: { id: cartId },
            data: {
                lastUpdatedAt: new Date(),
            },
        });

        return this.getCart(cartId);
    }

    async removeItem(cartId: string, itemId: string) {
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId,
            },
        });

        if (!item) {
            throw new NotFoundException('Cart item not found');
        }

        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });

        // Update cart lastUpdatedAt
        await this.prisma.cart.update({
            where: { id: cartId },
            data: {
                lastUpdatedAt: new Date(),
            },
        });

        return this.getCart(cartId);
    }

    async clearCart(cartId: string) {
        await this.prisma.cartItem.deleteMany({
            where: { cartId },
        });

        return this.getCart(cartId);
    }

    async findAbandonedCarts(hoursAgo: number) {
        const threshold = new Date();
        threshold.setHours(threshold.getHours() - hoursAgo);

        return this.prisma.cart.findMany({
            where: {
                lastUpdatedAt: {
                    lte: threshold,
                },
                reminded: false,
                items: {
                    some: {},
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }

    async markCartAsReminded(cartId: string) {
        return this.prisma.cart.update({
            where: { id: cartId },
            data: {
                reminded: true,
            },
        });
    }
}
