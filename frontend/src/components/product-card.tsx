'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import ProductQuickView from './product-quick-view';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock === 0;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
        : 0;

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    return (

        <>
            <Link href={`/produit/${product.slug}`} className="group relative flex flex-col">
                <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 relative rounded-md">
                    {/* Badges Overlay */}
                    <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5 items-start">
                        {/* Discount Badge */}
                        {hasDiscount && !isOutOfStock && (
                            <span className="bg-[#e11d48] px-2 py-0.5 text-[11px] font-bold text-white rounded-sm">
                                -{discountPercentage}%
                            </span>
                        )}
                        {/* Size/Stock Badge if needed (Optional) */}
                        {isOutOfStock && (
                            <span className="bg-zinc-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm">
                                Épuisé
                            </span>
                        )}

                        {/* Rating Badge (Now on image) */}
                        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm shadow-sm select-none">
                            <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="text-[10px] font-bold text-zinc-900">{(product as any).averageRating || 4.8}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">({(product as any).reviewsCount || 12})</span>
                        </div>
                    </div>

                    {/* Wishlist Button */}
                    <div className="absolute right-2 top-2 z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Add to wishlist', product.id);
                            }}
                            className="rounded-full bg-white p-1.5 text-zinc-400 hover:text-red-500 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Swap Logic */}
                    {product.images && product.images.length > 0 ? (
                        <>
                            {/* Primary Image (Always visible, behind) */}
                            <Image
                                src={getImageUrl(product.images[0])}
                                alt={product.title}
                                fill
                                className={`object-cover object-center ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                loading="lazy"
                            />

                            {/* Secondary Image (Visible on hover) */}
                            {product.images[1] && (
                                <Image
                                    src={getImageUrl(product.images[1])}
                                    alt={product.title}
                                    fill
                                    className={`object-cover object-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 ${isOutOfStock ? 'grayscale' : ''}`}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            )}
                        </>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-zinc-200 text-zinc-400 text-xs">
                            Pas d'image
                        </div>
                    )}

                    {/* Clean Bottom Overlay (Sparkle Icon) */}
                    <div className="absolute bottom-2 right-2 z-10 opacity-70">
                        <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                    </div>

                    {/* Add to Cart Button Overlay (Slide Up) */}
                    {/* Add to Cart / View Options Overlay */}
                    {!isOutOfStock && (
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex gap-2">
                            <span
                                role="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const hasVariants = (product.variants?.length ?? 0) > 0 || (product.options?.length ?? 0) > 0;
                                    if (hasVariants) {
                                        setIsQuickViewOpen(true);
                                        return;
                                    }

                                    console.log('Add to cart regarding simple product', product.id);
                                    // TODO: Implement direct add to cart for simple products
                                }}
                                className="flex-1 flex items-center justify-center bg-white text-zinc-900 text-[10px] font-bold uppercase py-3 rounded-sm shadow-lg hover:bg-zinc-50 tracking-widest cursor-pointer"
                            >
                                {(product.variants?.length ?? 0) > 0 || (product.options?.length ?? 0) > 0
                                    ? 'Choisir'
                                    : 'Ajouter'}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsQuickViewOpen(true);
                                }}
                                className="flex items-center justify-center w-10 bg-white text-zinc-900 rounded-sm shadow-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                                aria-label="Aperçu rapide"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Info (Simplified) */}
                <div className="mt-3 space-y-1 px-1">
                    <h3 className={`text-sm font-medium line-clamp-1 group-hover:text-amber-700 transition-colors ${isOutOfStock ? 'text-zinc-400' : 'text-zinc-900'}`}>
                        {product.title}
                    </h3>

                    <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-bold ${isOutOfStock ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                            {(product.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-zinc-400 line-through decoration-zinc-400/50">
                                {(product.compareAtPrice! / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </span>
                        )}
                    </div>

                    {/* Shipped Status */}
                    {!isOutOfStock && (
                        <div className="flex items-center gap-1.5 pt-1">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-tight">Expédié sous 24h</span>
                        </div>
                    )}
                </div>
            </Link>

            <ProductQuickView
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
}
