// Admin Orders API

import { api } from './client';
import type { Order } from '../types';

export const adminOrdersApi = {
    /**
     * Get all orders (admin)
     */
    getOrders: async (token: string, status?: string) => {
        const url = status ? `/admin/orders?status=${status}` : '/admin/orders';
        return api.get<Order[]>(url, token);
    },

    /**
     * Get order by ID
     */
    getOrderById: async (id: string, token: string) => {
        return api.get<Order>(`/admin/orders/${id}`, token);
    },

    /**
     * Update order status
     */
    updateOrderStatus: async (id: string, status: string, token: string) => {
        return api.patch<Order>(`/admin/orders/${id}`, { status }, token);
    },
};
