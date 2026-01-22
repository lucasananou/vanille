// Admin Customers API

import { api } from './client';

export interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    _count?: {
        orders: number;
    };
}

export const adminCustomersApi = {
    /**
     * Get all customers (admin)
     */
    getCustomers: async (token: string) => {
        return api.get<Customer[]>('/admin/customers', token);
    },

    /**
     * Get customer by ID
     */
    getCustomerById: async (id: string, token: string) => {
        return api.get<Customer>(`/admin/customers/${id}`, token);
    },
};
