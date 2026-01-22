'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, ProductVariant } from './types';

export interface CartItem {
    id: string;
    productId: string;
    variantId?: string;
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    price: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    total: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
        setItems((currentItems) => {
            // Check if item already exists
            const existingIndex = currentItems.findIndex(
                (item) =>
                    item.productId === product.id &&
                    item.variantId === variant?.id
            );

            if (existingIndex > -1) {
                // Update quantity if item exists
                const newItems = [...currentItems];
                newItems[existingIndex].quantity += quantity;
                return newItems;
            }

            // Add new item
            const newItem: CartItem = {
                id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
                productId: product.id,
                variantId: variant?.id,
                product,
                variant,
                quantity,
                price: variant?.price || product.price,
            };

            return [...currentItems, newItem];
        });
    };

    const removeItem = (itemId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                total,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
