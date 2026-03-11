import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
    private stripe: Stripe | null = null;
    private stripeSecretKey: string | null = null;
    private readonly shippingLaunchDiscountRate = 0.5;

    constructor(
        private prisma: PrismaService,
        private productsService: ProductsService,
        private cartService: CartService,
        private configService: ConfigService,
        private mailService: MailService,
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

    private buildProductLookup(products: Array<{ id: string; slug: string; sku: string; title: string; images: string[] }>) {
        const byAnyKey = new Map<string, (typeof products)[number]>();

        for (const product of products) {
            byAnyKey.set(product.id, product);
            byAnyKey.set(product.slug, product);
            byAnyKey.set(product.sku, product);
        }

        return byAnyKey;
    }

    private async resolveShippingCost(shippingRateId?: string, shippingCost?: number) {
        if (shippingRateId) {
            const rate = await this.prisma.shippingRate.findUnique({
                where: { id: shippingRateId },
                select: { id: true, price: true },
            });

            if (rate) {
                return {
                    shippingCost: Math.max(0, Math.round(rate.price * (1 - this.shippingLaunchDiscountRate))),
                    shippingRateId: rate.id,
                };
            }
        }

        return {
            shippingCost: shippingCost !== undefined ? shippingCost : 1000,
            shippingRateId: undefined,
        };
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
            const normalizedDirectItems = directItems.map((item: any) => ({
                ...item,
                variantId: item.variantId || undefined,
                quantity: Number(item.quantity),
                price: Number(item.price),
            }));

            for (const item of normalizedDirectItems) {
                if (!item.productId) {
                    throw new BadRequestException('Each checkout item must include productId.');
                }
                if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
                    throw new BadRequestException(`Invalid quantity for product ${item.productId}.`);
                }
                if (!Number.isFinite(item.price) || item.price < 0) {
                    throw new BadRequestException(`Invalid price for product ${item.productId}.`);
                }
            }

            // Enrich direct items with title/image if missing to satisfy OrderItem schema
            const productRefs = Array.from(new Set(normalizedDirectItems.map((item: any) => item.productId).filter(Boolean)));
            const products = productRefs.length
                ? await this.prisma.product.findMany({
                    where: {
                        OR: [
                            { id: { in: productRefs } },
                            { slug: { in: productRefs } },
                            { sku: { in: productRefs } },
                        ],
                    },
                    select: { id: true, slug: true, sku: true, title: true, images: true },
                })
                : [];

            const productByRef = this.buildProductLookup(products);
            const missingProductIds = productRefs.filter((ref) => !productByRef.has(ref));
            if (missingProductIds.length > 0) {
                throw new BadRequestException(
                    `Invalid products in checkout: ${missingProductIds.join(', ')}`,
                );
            }

            const normalizedItemsWithCanonicalProductId = normalizedDirectItems.map((item: any) => {
                const product = productByRef.get(item.productId);
                return {
                    ...item,
                    productId: product!.id,
                };
            });

            const variantIds = Array.from(
                new Set(normalizedItemsWithCanonicalProductId.map((item: any) => item.variantId).filter(Boolean)),
            ) as string[];
            if (variantIds.length > 0) {
                const variants = await this.prisma.productVariant.findMany({
                    where: { id: { in: variantIds } },
                    select: { id: true, productId: true },
                });
                const variantById = new Map(variants.map((v) => [v.id, v]));

                const missingVariantIds = variantIds.filter((id) => !variantById.has(id));
                if (missingVariantIds.length > 0) {
                    throw new BadRequestException(
                        `Invalid variants in checkout: ${missingVariantIds.join(', ')}`,
                    );
                }

                for (const item of normalizedItemsWithCanonicalProductId as any[]) {
                    if (!item.variantId) continue;
                    const variant = variantById.get(item.variantId);
                    if (variant && variant.productId !== item.productId) {
                        throw new BadRequestException(
                            `Variant ${item.variantId} does not belong to product ${item.productId}`,
                        );
                    }
                }
            }

            orderItems = normalizedItemsWithCanonicalProductId.map((item: any) => {
                const product = productByRef.get(item.productId);
                return {
                    ...item,
                    title: item.title || product?.title || 'Produit',
                    image: item.image || product?.images?.[0] || null,
                };
            });
            subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        } else {
            throw new BadRequestException('Either cartId or items must be provided');
        }

        // Calculate totals
        const tax = directTax !== undefined ? directTax : Math.round(subtotal * 0.1); // Fallback to 10% tax if not provided
        const resolvedShipping = await this.resolveShippingCost(shippingRateId, shippingCost);
        const shipping = resolvedShipping.shippingCost;
        const total = subtotal + tax + shipping;

        // Generate unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Only keep shippingRateId when it exists in DB to avoid FK errors from frontend fallback IDs
        // Create order
        let order: any;
        try {
            order = await this.prisma.order.create({
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
                    shippingRateId: resolvedShipping.shippingRateId,
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new BadRequestException(
                        'Invalid checkout references (product, variant or shipping rate).',
                    );
                }
                if (error.code === 'P2002') {
                    throw new BadRequestException('Duplicate order number generated. Please retry.');
                }
                if (error.code === 'P2023') {
                    throw new BadRequestException('Invalid identifier format in checkout payload.');
                }
                throw new BadRequestException(`Checkout data rejected (${error.code}).`);
            }
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new BadRequestException('Invalid checkout payload format.');
            }
            throw error;
        }

        // Transactional email (non-blocking)
        this.mailService
            .sendOrderConfirmation(order.email, order.orderNumber, order)
            .catch((error) => console.error('Failed to send order confirmation:', error));

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

    async markOrderAsPaid(orderId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status === OrderStatus.PAID) {
            return order;
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.PAID },
        });

        this.mailService
            .sendPaymentConfirmation(updatedOrder.email, updatedOrder.orderNumber)
            .catch((error) => console.error('Failed to send payment confirmation:', error));

        return updatedOrder;
    }
}
