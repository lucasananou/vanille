import { api } from './client';

export const paymentsApi = {
    async createPaymentIntent(amount: number, currency: string = 'eur') {
        const response = await api.post<{ clientSecret: string }>('/payments/create-intent', {
            amount,
            currency,
        });
        return response; // api.post already returns the data
    },
};
