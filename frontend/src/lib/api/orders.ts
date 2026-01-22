// Orders API functions

import { api } from './client';
import type { Order } from '../types';

export interface CreateOrderDto {
    email: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province?: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        address1: string;
        address2?: string;
        city: string;
        province?: string;
        postalCode: string;
        country: string;
        phone?: string;
    };
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
        price: number;
    }>;
    shippingCost: number;
    tax: number;
}

export const ordersApi = {
    /**
     * Create a new order
     */
    createOrder: async (data: CreateOrderDto, token?: string) => {
        return api.post<Order>('/orders', data, token);
    },

    /**
     * Get customer orders
     */
    getOrders: async (token: string) => {
        return api.get<Order[]>('/orders', token);
    },

    /**
     * Get order by ID
     */
    getOrderById: async (orderId: string, token?: string) => {
        return api.get<Order>(`/orders/${orderId}`, token);
    },
};
