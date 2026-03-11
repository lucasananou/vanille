import { api } from './client';

export const paymentsApi = {
    async createPaymentIntent(amount: number, currency: string = 'eur', subtotalAmount?: number, shippingRateId?: string, tax: number = 0) {
        const response = await api.post<{ clientSecret: string }>('/payments/create-intent', {
            amount,
            currency,
            subtotalAmount,
            shippingRateId,
            tax,
        });
        return response; // api.post already returns the data
    },

    async createPayPalOrder(amount: number, currency: string = 'EUR', subtotalAmount?: number, shippingRateId?: string, tax: number = 0) {
        return api.post<{ id: string }>('/payments/paypal/create-order', {
            amount,
            currency,
            subtotalAmount,
            shippingRateId,
            tax,
        });
    },

    async finalizePayPalOrder(paypalOrderId: string, order: any) {
        return api.post<{ orderId: string; orderNumber: string; captureId: string }>(
            '/payments/paypal/finalize-order',
            { paypalOrderId, order },
        );
    },
};
