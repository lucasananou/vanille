'use client';

import { useCart } from '@/lib/cart-context';


export default function CartButton() {
    const { itemCount, openCart } = useCart();

    return (
        <button
            onClick={openCart}
            className="relative cursor-pointer p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
            aria-label="Ouvrir le panier"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white">
                    {itemCount}
                </span>
            )}
        </button>
    );
}
