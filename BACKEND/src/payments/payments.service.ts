import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Injectable()
export class PaymentsService {
    private stripe: Stripe | null = null;
    private stripeSecretKey: string | null = null;
    private paypalClientId: string | null = null;
    private paypalClientSecret: string | null = null;
    private paypalEnvironment: string = 'sandbox';

    constructor(
        private readonly configService: ConfigService,
        private readonly ordersService: OrdersService,
    ) {
        this.stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || null;
        this.paypalClientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || null;
        this.paypalClientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || null;
        this.paypalEnvironment = this.configService.get<string>('PAYPAL_ENV', 'sandbox');
    }

    private getStripe(): Stripe {
        if (!this.stripeSecretKey) {
            throw new ServiceUnavailableException(
                'Stripe is not configured: missing STRIPE_SECRET_KEY environment variable.',
            );
        }

        if (!this.stripe) {
            this.stripe = new Stripe(this.stripeSecretKey, {
                apiVersion: '2025-12-15.clover' as any,
                typescript: true,
            });
        }

        return this.stripe;
    }

    async createPaymentIntent(amount: number, currency: string = 'eur') {
        try {
            const paymentIntent = await this.getStripe().paymentIntents.create({
                amount: Math.round(amount), // Amount is already expected in cents from the controller
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
            };
        } catch (error: any) {
            console.error('Stripe API Error:', error.message);
            if (error.type === 'StripeAuthenticationError') {
                throw new Error('Stripe authentication failed. Please check your STRIPE_SECRET_KEY in .env');
            }
            throw error;
        }
    }

    private getPayPalBaseUrl() {
        return this.paypalEnvironment === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    private async getPayPalAccessToken() {
        if (!this.paypalClientId || !this.paypalClientSecret) {
            throw new ServiceUnavailableException(
                'PayPal is not configured: missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET.',
            );
        }

        const auth = Buffer.from(`${this.paypalClientId}:${this.paypalClientSecret}`).toString('base64');
        const response = await fetch(`${this.getPayPalBaseUrl()}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new ServiceUnavailableException(`Failed to authenticate with PayPal: ${errorText}`);
        }

        const data = await response.json();
        return data.access_token as string;
    }

    async createPayPalOrder(amountInCents: number, currency: string = 'EUR') {
        if (!amountInCents || amountInCents <= 0) {
            throw new BadRequestException('Amount must be greater than 0');
        }

        const accessToken = await this.getPayPalAccessToken();
        const value = (amountInCents / 100).toFixed(2);

        const response = await fetch(`${this.getPayPalBaseUrl()}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency.toUpperCase(),
                            value,
                        },
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new BadRequestException(`PayPal order creation failed: ${errorText}`);
        }

        return response.json();
    }

    async capturePayPalOrder(paypalOrderId: string) {
        if (!paypalOrderId) {
            throw new BadRequestException('paypalOrderId is required');
        }

        const accessToken = await this.getPayPalAccessToken();
        const response = await fetch(`${this.getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new BadRequestException(`PayPal capture failed: ${errorText}`);
        }

        return response.json();
    }

    async finalizePayPalOrder(paypalOrderId: string, orderDto: CreateOrderDto) {
        const captureData = await this.capturePayPalOrder(paypalOrderId);
        const captureStatus = captureData?.status;
        const capture =
            captureData?.purchase_units?.[0]?.payments?.captures?.[0];

        if (captureStatus !== 'COMPLETED' || capture?.status !== 'COMPLETED') {
            throw new BadRequestException('PayPal payment is not completed.');
        }

        if (!orderDto.items || orderDto.items.length === 0) {
            throw new BadRequestException('Order items are required for PayPal checkout.');
        }

        const subtotal = orderDto.items.reduce((sum, item: any) => sum + item.price * item.quantity, 0);
        const tax = orderDto.tax ?? 0;
        const shipping = orderDto.shippingCost ?? 0;
        const expectedTotal = subtotal + tax + shipping;
        const capturedTotal = Math.round(parseFloat(capture.amount.value) * 100);

        if (Math.abs(capturedTotal - expectedTotal) > 1) {
            throw new BadRequestException('Captured PayPal amount does not match order total.');
        }

        const order = await this.ordersService.createOrder(orderDto);
        await this.ordersService.markOrderAsPaid(order.id);

        return {
            orderId: order.id,
            orderNumber: order.orderNumber,
            paypalOrderId,
            captureId: capture.id,
        };
    }
}
