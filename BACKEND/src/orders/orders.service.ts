import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    private stripe: Stripe | null = null;
    private stripeSecretKey: string | null = null;

    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
        private cartService: CartService,
        private configService: ConfigService,
    ) {
        this.stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || null;
    }

    private getStripe(): Stripe {
        if (!this.stripeSecretKey) {
            throw new ServiceUnavailableException(
                'Stripe is not configured: missing STRIPE_SECRET_KEY environment variable.',
            );
        }
        if (!this.stripe) {
            this.stripe = new Stripe(this.stripeSecretKey, {
                apiVersion: '2025-12-15.clover',
            });
        }
        return this.stripe;
    }

    async createOrder(createOrderDto: CreateOrderDto) {
        const { cartId, email, shippingAddress, billingAddress, items: directItems, shippingCost, shippingRateId, tax: directTax } = createOrderDto;

        let orderItems: any[] = [];
        let subtotal = 0;
        let customerId: string | undefined;

        if (cartId) {
            // Get cart with items
            const cart = await this.cartService.getCart(cartId);

            if (!cart.items || cart.items.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            subtotal = cart.subtotal;
            customerId = cart.customerId || undefined;
            orderItems = cart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
                title: item.product.title,
                image: item.product.images[0],
            }));

            // Clear cart
            await this.cartService.clearCart(cartId);
        } else if (directItems && directItems.length > 0) {
            orderItems = directItems;
            subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        } else {
            throw new BadRequestException('Either cartId or items must be provided');
        }

        // Calculate totals
        const tax = directTax !== undefined ? directTax : Math.round(subtotal * 0.1); // Fallback to 10% tax if not provided
        const shipping = shippingCost !== undefined ? shippingCost : 1000; // Fallback to 1000 if not provided
        const total = subtotal + tax + shipping;

        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Create order
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                email,
                subtotal,
                tax,
                shipping,
                total,
                status: OrderStatus.PENDING,
                shippingAddress,
                billingAddress: billingAddress || shippingAddress,
                customerId,
                shippingRateId,
                items: {
                    create: orderItems.map((item) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        price: item.price,
                        title: item.title,
                        image: item.image,
                    })),
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

        return order;
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async findAll(skip = 0, take = 50, status?: string) {
        const where: any = {};
        if (status) {
            where.status = status as OrderStatus;
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                skip,
                take,
                where,
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    customer: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.order.count({ where }),
        ]);

        return orders;
    }

    async updateOrderStatus(id: string, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status as OrderStatus },
            include: {
                items: true,
            },
        });
    }

    async createPaymentIntent(orderId: string) {
        const order = await this.findOne(orderId);

        const paymentIntent = await this.getStripe().paymentIntents.create({
            amount: order.total,
            currency: 'usd',
            metadata: { orderId: order.id },
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }
}
