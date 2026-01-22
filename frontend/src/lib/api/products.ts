// Products API functions

import { api } from './client';
import type { Product, PaginatedResponse } from '../types';

export interface GetProductsParams {
    page?: number;
    limit?: number;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: 'price-asc' | 'price-desc' | 'newest' | 'featured';
}

export const productsApi = {
    /**
     * Get paginated list of products
     */
    getProducts: async (params: GetProductsParams = {}) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.set('page', params.page.toString());
        if (params.limit) searchParams.set('limit', params.limit.toString());
        if (params.collection) searchParams.set('collection', params.collection);
        if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
        if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
        if (params.search) searchParams.set('search', params.search);
        if (params.sort) searchParams.set('sort', params.sort);

        const query = searchParams.toString();
        const endpoint = `/store/products${query ? `?${query}` : ''}`;

        return api.get<PaginatedResponse<Product>>(endpoint);
    },

    /**
     * Get single product by slug
     */
    getProductBySlug: async (slug: string) => {
        return api.get<Product>(`/store/products/${slug}`);
    },

    /**
     * Get single product by ID
     */
    getProductById: async (id: string) => {
        return api.get<Product>(`/store/products/${id}`);
    },

    /**
     * Search products
     */
    searchProducts: async (query: string) => {
        return api.get<PaginatedResponse<Product>>(`/store/products?search=${encodeURIComponent(query)}`);
    },

    /**
     * Get products by collection
     */
    getProductsByCollection: async (collectionSlug: string, page = 1, limit = 12) => {
        return api.get<PaginatedResponse<Product>>(
            `/store/products?collection=${collectionSlug}&page=${page}&limit=${limit}`
        );
    },

    /**
     * Get related products
     */
    getRelatedProducts: async (productId: string, limit = 4) => {
        return api.get<Product[]>(
            `/store/recommendations/related/${productId}?limit=${limit}`
        );
    },

    /**
     * Get frequently bought together
     */
    getFrequentlyBoughtTogether: async (productId: string, limit = 3) => {
        return api.get<Product[]>(
            `/store/recommendations/frequently-bought-together/${productId}?limit=${limit}`
        );
    },
};
