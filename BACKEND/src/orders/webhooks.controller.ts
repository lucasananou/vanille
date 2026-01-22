import { Controller, Post, Headers, Req, HttpCode, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
    private stripe: Stripe | null = null;
    private webhookSecret: string | null = null;
    private stripeSecretKey: string | null = null;

    constructor(
        private ordersService: OrdersService,
        private configService: ConfigService,
    ) {
        this.stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || null;
        this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || null;
    }

    private getStripe(): Stripe {
        if (!this.stripeSecretKey) {
            throw new ServiceUnavailableException(
                'Stripe webhooks are not configured: missing STRIPE_SECRET_KEY environment variable.',
            );
        }
        if (!this.stripe) {
            this.stripe = new Stripe(this.stripeSecretKey, {
                apiVersion: '2025-12-15.clover',
            });
        }
        return this.stripe;
    }

    @Post('stripe')
    @HttpCode(200)
    async handleStripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
        let event: Stripe.Event;

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
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                // TODO: Implement payment success handling
                console.log('✅ Payment succeeded:', paymentIntent.id);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                // TODO: Implement payment failure handling
                console.log('❌ Payment failed:', failedPayment.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }
}
