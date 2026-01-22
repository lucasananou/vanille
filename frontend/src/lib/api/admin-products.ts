// Admin Products API

import { api } from './client';
import type { Product } from '../types';

export interface AdminProductsQuery {
    page?: number;
    limit?: number;
    search?: string;
    collectionId?: string;
    published?: boolean;
}

export const adminProductsApi = {
    /**
     * Get all products (admin)
     */
    getProducts: async (token: string, query?: AdminProductsQuery) => {
        const params = new URLSearchParams();
        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.search) params.append('search', query.search);
        if (query?.collectionId) params.append('collectionId', query.collectionId);
        if (query?.published !== undefined) params.append('published', query.published.toString());

        const url = `/admin/products${params.toString() ? '?' + params.toString() : ''}`;
        return api.get<any>(url, token);
    },

    /**
     * Get product by ID
     */
    getProductById: async (id: string, token: string) => {
        return api.get<Product>(`/admin/products/${id}`, token);
    },

    /**
     * Create product
     */
    createProduct: async (data: any, token: string) => {
        return api.post<Product>('/admin/products', data, token);
    },

    /**
     * Update product
     */
    updateProduct: async (id: string, data: any, token: string) => {
        return api.patch<Product>(`/admin/products/${id}`, data, token);
    },

    /**
     * Delete product
     */
    deleteProduct: async (id: string, token: string) => {
        return api.delete(`/admin/products/${id}`, token);
    },

    /**
     * Toggle product publish status
     */
    togglePublish: async (id: string, token: string) => {
        return api.patch<Product>(`/admin/products/${id}`, { published: true }, token);
    },

    /**
     * Delete multiple products
     */
    deleteBulkProducts: async (ids: string[], token: string) => {
        return api.post('/admin/products/bulk-delete', { ids }, token);
    },
};
