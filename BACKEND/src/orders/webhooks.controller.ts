import { Controller, Post, Headers, Req, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { OrdersService } from './orders.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(
        private ordersService: OrdersService,
        private configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2025-12-15.clover',
        });
        this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
    }

    @Post('stripe')
    @HttpCode(200)
    async handleStripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
        let event: Stripe.Event;

        try {
            // Verify webhook signature
            event = this.stripe.webhooks.constructEvent(
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
