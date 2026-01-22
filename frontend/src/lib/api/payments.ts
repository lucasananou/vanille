import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const paymentsApi = {
    async createPaymentIntent(amount: number, currency: string = 'eur') {
        const response = await axios.post(`${API_URL}/payments/create-intent`, {
            amount,
            currency,
        });
        return response.data; // Expected: { clientSecret: string }
    },
};
