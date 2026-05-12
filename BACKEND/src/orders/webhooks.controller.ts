import { Controller, Post, Headers, Req, HttpCode, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
    private stripe: ReturnType<typeof Stripe> | null = null;
    private webhookSecret: string | null = null;
    private stripeSecretKey: string | null = null;

    constructor(
        private ordersService: OrdersService,
        private configService: ConfigService,
    ) {
        this.stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || null;
        this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || null;
    }

    private getStripe(): ReturnType<typeof Stripe> {
        if (!this.stripeSecretKey) {
            throw new ServiceUnavailableException(
                'Stripe webhooks are not configured: missing STRIPE_SECRET_KEY environment variable.',
            );
        }
        if (!this.stripe) {
            this.stripe = new Stripe(this.stripeSecretKey, {
                apiVersion: '2026-04-22.dahlia',
            });
        }
        return this.stripe;
    }

    @Post('stripe')
    @HttpCode(200)
    @SkipThrottle()
    async handleStripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
        let event: any;

        if (!this.webhookSecret) {
            throw new ServiceUnavailableException(
                'Stripe webhooks are not configured: missing STRIPE_WEBHOOK_SECRET environment variable.',
            );
        }

        try {
            // Verify webhook signature
            event = this.getStripe().webhooks.constructEvent(
                req.rawBody || req.body,
                signature,
                this.webhookSecret,
            );
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return { error: 'Invalid signature' };
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as { id: string; metadata?: { orderId?: string } };
                console.log('✅ Payment succeeded:', paymentIntent.id);
                if (paymentIntent.metadata?.orderId) {
                    await this.ordersService.markOrderAsPaid(paymentIntent.metadata.orderId);
                } else {
                    console.warn('payment_intent.succeeded without orderId metadata:', paymentIntent.id);
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as { id: string };
                // TODO: Implement payment failure handling
                console.log('❌ Payment failed:', failedPayment.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }
}
