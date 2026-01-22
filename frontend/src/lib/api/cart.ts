// Cart API functions

import { api } from './client';
import type { Cart, CartItem } from '../types';

export interface AddToCartDto {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

export const cartApi = {
    /**
     * Get current cart (requires auth)
     */
    getCart: async (token: string) => {
        return api.get<Cart>('/customer/cart', token);
    },

    /**
     * Add item to cart
     */
    addItem: async (data: AddToCartDto, token?: string) => {
        return api.post<CartItem>('/customer/cart/items', data, token);
    },

    /**
     * Update cart item quantity
     */
    updateItem: async (itemId: string, data: UpdateCartItemDto, token?: string) => {
        return api.patch<CartItem>(`/customer/cart/items/${itemId}`, data, token);
    },

    /**
     * Remove item from cart
     */
    removeItem: async (itemId: string, token?: string) => {
        return api.delete(`/customer/cart/items/${itemId}`, token);
    },

    /**
     * Clear entire cart
     */
    clearCart: async (token?: string) => {
        return api.delete('/customer/cart', token);
    },
};
