'use client';

import { useCart } from '@/lib/cart-context';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { getImageUrl } from '@/lib/utils';
import { Product } from '@/lib/types';

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, itemCount, total, isCartOpen, closeCart, addItem } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);

    // CRO: Free Shipping Threshold
    const FREE_SHIPPING_THRESHOLD = 15000; // 150€ in cents
    const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

    // CRO: Total Savings calculation
    const totalSavings = items.reduce((acc, item) => {
        const currentPrice = item.price;
        const compareAtPrice = item.product.compareAtPrice;
        if (compareAtPrice && compareAtPrice > currentPrice) {
            return acc + (compareAtPrice - currentPrice) * item.quantity;
        }
        return acc;
    }, 0);

    // CRO: Upsells
    const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isCartOpen) {
            // Fetch potential upsells (cheap items or just products not in cart)
            productsApi.getProducts({ limit: 5 }).then(res => {
                if (res.data) {
                    // Filter out items already in cart
                    const candidates = res.data.filter(p => !items.some(i => i.productId === p.id)).slice(0, 3);
                    setUpsellProducts(candidates);
                }
            }).catch(console.error);
        }
    }, [isCartOpen, items]);


    // Disable body scroll when drawer is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                closeCart();
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen, closeCart]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full bg-white">
                    {/* Header */}
                    <div className="flex flex-col bg-white">
                        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center text-zinc-900">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </span>
                                <h2 className="text-xl font-bold text-zinc-900">Panier ({itemCount})</h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* CRO: Free Shipping Bar */}
                        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-100">
                            {amountLeft > 0 ? (
                                <p className="text-xs text-center text-zinc-600 mb-2">
                                    Plus que <span className="font-bold text-zinc-900">{(amountLeft / 100).toFixed(2).replace('.', ',')} €</span> pour la livraison offerte (France)
                                </p>
                            ) : (
                                <p className="text-xs text-center text-green-700 font-bold mb-2 flex items-center justify-center gap-1">
                                    <span>🎉</span> Livraison offerte !
                                </p>
                            )}
                            <div className="h-[2px] w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-zinc-900 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
                                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-zinc-900">Votre panier est vide</h3>
                                <p className="text-sm text-zinc-500 max-w-[250px]">
                                    Découvrez nos nouvelles collections et trouvez votre bonheur.
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="mt-6 px-8 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-colors shadow-lg"
                                >
                                    Commencer mes achats
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 space-y-8">
                                {items.map((item) => {
                                    const currentPrice = (item.price / 100);
                                    const compareAtPrice = item.product.compareAtPrice ? (item.product.compareAtPrice / 100) : null;
                                    const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
                                    const discountPercentage = hasDiscount
                                        ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
                                        : 0;

                                    return (
                                        <div key={item.id} className="flex gap-5">
                                            {/* Image */}
                                            <div className="relative w-22 h-32 flex-shrink-0 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-100 shadow-sm group">
                                                {item.product.images?.[0] && (
                                                    <Image
                                                        src={getImageUrl(item.product.images[0])}
                                                        alt={item.product.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        sizes="80px"
                                                    />
                                                )}
                                                {hasDiscount && (
                                                    <div className="absolute top-2 left-2 bg-[#e11d48] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                                                        -{discountPercentage}%
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-[13px] font-bold text-zinc-900 line-clamp-2 pr-4 leading-tight uppercase tracking-tight">
                                                        {item.product.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {item.variant?.options && (
                                                    <p className="text-[10px] text-zinc-500 mb-2 font-medium uppercase tracking-widest">
                                                        {Object.values(item.variant.options).join(' ')}
                                                    </p>
                                                )}

                                                <div className="mb-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[13px] font-bold text-zinc-900">
                                                            {currentPrice.toFixed(2).replace('.', ',')} €
                                                        </span>
                                                        {hasDiscount && (
                                                            <span className="text-[11px] text-zinc-400 line-through font-medium">
                                                                {compareAtPrice.toFixed(2).replace('.', ',')} €
                                                            </span>
                                                        )}
                                                    </div>
                                                    {hasDiscount && (
                                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">
                                                            Économies réalisées : -{((compareAtPrice - currentPrice) * item.quantity).toFixed(2).replace('.', ',')} €
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-sm border border-zinc-200">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                            className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                                        >
                                                            <span className="text-base leading-none">-</span>
                                                        </button>
                                                        <span className="text-[11px] font-bold text-zinc-900 w-4 text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                                                        >
                                                            <span className="text-base leading-none">+</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* CRO: In-Cart Upsells - Stable 3-column grid */}
                                {upsellProducts.length > 0 && (
                                    <div className="pt-8 border-t border-zinc-100 mt-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-5 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
                                            Complétez votre look
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {upsellProducts.map(product => (
                                                <div key={product.id} className="group relative flex flex-col">
                                                    <div className="relative aspect-[3/4] bg-zinc-50 rounded-sm overflow-hidden mb-2 border border-zinc-100">
                                                        {product.images?.[0] && (
                                                            <Image
                                                                src={getImageUrl(product.images[0])}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                sizes="(max-width: 768px) 33vw, 100px"
                                                            />
                                                        )}
                                                        <button
                                                            className="absolute inset-x-2 bottom-2 bg-white/95 text-zinc-900 text-[8px] font-bold uppercase tracking-widest py-2 rounded-sm shadow-sm hover:bg-zinc-900 hover:text-white transition-all opacity-0 lg:group-hover:opacity-100 translate-y-1 lg:group-hover:translate-y-0 duration-300"
                                                            onClick={() => addItem(product, 1)}
                                                        >
                                                            Ajouter
                                                        </button>
                                                        {/* Mobile add button (always visible) */}
                                                        <button
                                                            className="lg:hidden absolute bottom-1 right-1 w-6 h-6 bg-white/95 rounded-full flex items-center justify-center shadow-sm"
                                                            onClick={() => addItem(product, 1)}
                                                        >
                                                            <span className="text-zinc-900 text-sm font-bold">+</span>
                                                        </button>
                                                    </div>
                                                    <h4 className="text-[10px] font-bold text-zinc-900 line-clamp-1 group-hover:text-amber-700 transition-colors">{product.title}</h4>
                                                    <p className="text-[9px] font-medium text-zinc-500">{(product.price / 100).toFixed(2).replace('.', ',')} €</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer - Only show if items exist */}
                    {items.length > 0 && (
                        <div className="bg-white border-t border-zinc-100 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                            <div className="p-6 bg-zinc-50/50">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-zinc-600">
                                        <span>Sous-total</span>
                                        <span>{(total / 100).toFixed(2).replace('.', ',')} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-zinc-600">
                                        <span>Livraison</span>
                                        <span className={amountLeft === 0 ? "text-green-600 font-bold" : "text-zinc-500"}>
                                            {amountLeft === 0 ? "Offerte" : "Calculée à l'étape suivante"}
                                        </span>
                                    </div>
                                    {totalSavings > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium bg-green-50/50 -mx-2 px-2 py-1 rounded-sm border border-green-100/50">
                                            <span>Économies réalisées</span>
                                            <span className="font-bold">
                                                -{(totalSavings / 100).toFixed(2).replace('.', ',')} €
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                        <span className="text-base font-bold text-zinc-900">Total</span>
                                        <span className="text-xl font-bold text-zinc-900">
                                            {(total / 100).toFixed(2).replace('.', ',')} €
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href="/checkout"
                                        onClick={closeCart}
                                        className="w-full block bg-zinc-900 text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg rounded-sm"
                                    >
                                        COMMANDER
                                    </Link>
                                </div>
                                <p className="text-[10px] text-center text-zinc-400 mt-4 flex items-center justify-center gap-1">
                                    🔒 Paiement 100% sécurisé
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
