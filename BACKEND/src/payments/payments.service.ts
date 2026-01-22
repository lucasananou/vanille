import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor() {
        // Initialize Stripe securely
        // Note: ensure STRIPE_SECRET_KEY is in .env
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
            apiVersion: '2025-12-15.clover' as any, // Typed as any to avoid version mismatches
            typescript: true,
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'eur') {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Stripe expects amounts in cents
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
}
