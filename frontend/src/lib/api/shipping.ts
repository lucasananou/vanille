import { apiClient } from './client';

export interface ShippingRate {
    id: string;
    name: string;
    price: number;
    estimatedDays?: string;
    zoneName: string;
}

export const shippingApi = {
    calculateAvailableRates: async (country: string, orderValue: number, region?: string): Promise<{ availableRates: ShippingRate[], message?: string }> => {
        const response = await apiClient<{ availableRates: ShippingRate[], message?: string }>('/store/shipping/calculate', {
            method: 'POST',
            body: JSON.stringify({ country, orderValue, region }),
        });
        return response;
    },

    estimateShipping: async (country: string, region?: string): Promise<{ estimatedCost: number, estimatedDays?: string } | null> => {
        const params = new URLSearchParams({ country });
        if (region) params.append('region', region);

        try {
            const response = await apiClient<any>(`/store/shipping/estimate?${params.toString()}`, {
                method: 'GET'
            });
            if (response.message) return null;
            return response;
        } catch (err) {
            return null;
        }
    }
};
