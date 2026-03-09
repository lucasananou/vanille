import { api } from './client';

export const paymentsApi = {
    async createPaymentIntent(amount: number, currency: string = 'eur') {
        const response = await api.post<{ clientSecret: string }>('/payments/create-intent', {
            amount,
            currency,
        });
        return response; // api.post already returns the data
    },

    async createPayPalOrder(amount: number, currency: string = 'EUR') {
        return api.post<{ id: string }>('/payments/paypal/create-order', {
            amount,
            currency,
        });
    },

    async finalizePayPalOrder(paypalOrderId: string, order: any) {
        return api.post<{ orderId: string; orderNumber: string; captureId: string }>(
            '/payments/paypal/finalize-order',
            { paypalOrderId, order },
        );
    },
};
