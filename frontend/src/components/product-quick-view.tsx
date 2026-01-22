'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import type { Product, ProductVariant } from '@/lib/types';

interface ProductQuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { addItem } = useCart();
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    // Reset options when product changes or modal opens
    useEffect(() => {
        if (isOpen) {
            const initialOptions: Record<string, string> = {};
            product.options?.forEach(opt => {
                if (opt.values && opt.values.length > 0) {
                    initialOptions[opt.name] = opt.values[0];
                }
            });
            setSelectedOptions(initialOptions);
            setSelectedImage(0); // Reset selected image when opening
        }
    }, [isOpen, product]);

    // Find matching variant
    useEffect(() => {
        if (!product.variants || product.variants.length === 0) {
            setCurrentVariant(null);
            return;
        }

        const variant = product.variants.find(v => {
            if (!v.options || typeof v.options !== 'object') return false;
            const vOptions = v.options as Record<string, string>;
            return Object.entries(selectedOptions).every(([key, value]) =>
                vOptions[key] === value || (key && vOptions[key.toLowerCase()] === value)
            );
        });

        setCurrentVariant(variant || null);
    }, [selectedOptions, product.variants]);

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleAddToCart = async () => {
        if (!currentVariant && (product.variants?.length ?? 0) > 0) return;

        setIsAdding(true);
        try {
            // Fix: addItem expects (product, quantity, variant)
            await addItem(product, 1, currentVariant || undefined);
            onClose();
        } catch (error) {
            console.error('Failed to add to cart', error);
        } finally {
            setIsAdding(false);
        }
    };

    if (!isOpen) return null;

    // Fix: Fallback to product price if variant price is undefined
    const price = (currentVariant?.price) ?? product.price;
    const compareAtPrice = (currentVariant?.compareAtPrice) ?? product.compareAtPrice;
    const isOutOfStock = currentVariant ? currentVariant.stock === 0 : product.stock === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[500px] animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-600 transition"
                    aria-label="Fermer"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image Section (Full Height) */}
                <div className="w-full md:w-1/2 bg-zinc-100 relative h-full flex flex-col p-4">
                    {product.images && product.images.length > 0 ? (
                        <>
                            <div className="relative aspect-[4/5] bg-zinc-50 rounded-md overflow-hidden flex-grow mb-4">
                                <Image
                                    src={getImageUrl(product.images[selectedImage])}
                                    alt={product.title}
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="flex gap-2 justify-center flex-wrap">
                                {product.images.map((image, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative w-16 h-20 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-amber-600 ring-1 ring-amber-600' : 'border-transparent hover:border-zinc-200'}`}
                                    >
                                        <Image
                                            src={getImageUrl(image)}
                                            alt={`${product.title} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-400">Pas d'image</div>
                    )}
                </div>

                {/* Right: Details Section */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full overflow-y-auto bg-white">

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2 leading-tight pr-8">
                        {product.title}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-8">
                        <span className="text-xl font-bold text-zinc-900">
                            {(price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </span>
                        {compareAtPrice && compareAtPrice > price && (
                            <>
                                <span className="text-base text-zinc-400 line-through">
                                    {(compareAtPrice / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </span>
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 text-xs font-bold uppercase rounded-sm">
                                    -{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
                                </span>
                            </>
                        )}
                        {isOutOfStock && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Épuisé</span>
                        )}
                    </div>

                    {/* Options (Size etc.) */}
                    <div className="space-y-6 mb-8">
                        {product.options?.map((option) => (
                            <div key={option.id}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                        {option.name}:
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">
                                        {selectedOptions[option.name]}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {option.values.map((value) => {
                                        const isSelected = selectedOptions[option.name] === value;
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => handleOptionChange(option.name, value)}
                                                className={`
                                                    min-w-[44px] h-11 px-3 flex items-center justify-center text-sm font-medium rounded-md border transition-all duration-200
                                                    ${isSelected
                                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-105'
                                                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                                                    }
                                                `}
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Actions and Info */}
                    <div className="mt-auto space-y-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAdding}
                            className={`
                                w-full py-4 rounded-md font-bold uppercase tracking-widest text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${isOutOfStock
                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    : isAdding
                                        ? 'bg-zinc-900 text-white cursor-wait opacity-80'
                                        : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg'
                                }
                            `}
                        >
                            {isAdding ? 'Ajout en cours...' : isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
                        </button>

                        <p className="text-[10px] text-center text-zinc-500 font-medium flex items-center justify-center gap-2">
                            <span className="opacity-80">💳 Paiement en 3x sans frais dès 80€</span>
                        </p>

                        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-600 font-medium pt-1 border-b border-zinc-100 pb-4 mb-2">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>En stock — <span className="text-zinc-900">expédié sous 24h</span></span>
                        </div>

                        {/* Mini Trust Badges */}
                        <div className="grid grid-cols-3 gap-2 py-2">
                            {[
                                { title: 'Livraison 2-4j', icon: '🚚' },
                                { title: 'Retours 30j', icon: 'Rw' }, // Simplified icon or text
                                { title: 'Paiement Sûr', icon: '🔒' }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    {/* Using SVGs for cleaner look matching ProductActions */}
                                    <div className="mb-1 text-zinc-900 scale-75 origin-bottom">
                                        {idx === 0 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        )}
                                        {idx === 1 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        )}
                                        {idx === 2 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-tighter leading-none">{badge.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-2">
                            <Link
                                href={`/produit/${product.slug}`}
                                className="inline-block text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                Voir la page complète
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
