'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import type { Product, ProductVariant } from '@/lib/types';
import { formatCurrency, withLocale } from '@/lib/i18n';
import { useLocale } from '@/lib/locale-context';

interface ProductQuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { locale } = useLocale();
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

            <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[500px] animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-zinc-600 transition"
                    aria-label={locale === 'en' ? 'Close' : 'Fermer'}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image Section (Full Height) */}
                <div className="w-full md:w-1/2 bg-zinc-100 relative h-full flex flex-col p-4">
                    {product.images && product.images.length > 0 ? (
                        <>
                            <div className="relative mb-4 aspect-[16/11] overflow-hidden rounded-md bg-zinc-50 md:aspect-[4/5]">
                                <Image
                                    src={getImageUrl(product.images[selectedImage])}
                                    alt={product.title}
                                    fill
                                    className="object-contain object-center p-3 md:object-cover md:p-0"
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
                        <div className="flex items-center justify-center h-full text-zinc-400">{locale === 'en' ? 'No image' : "Pas d'image"}</div>
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
                            {formatCurrency(price / 100, locale)}
                        </span>
                        {compareAtPrice && compareAtPrice > price && (
                            <>
                                <span className="text-base text-zinc-400 line-through">
                                    {formatCurrency(compareAtPrice / 100, locale)}
                                </span>
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 text-xs font-bold uppercase rounded-sm">
                                    -{Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
                                </span>
                            </>
                        )}
                        {isOutOfStock && (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{locale === 'en' ? 'Sold out' : 'Épuisé'}</span>
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
                                                        ? 'bg-zinc-900 text-white border-zinc-900 transform scale-105'
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
                                w-full py-4 rounded-md font-bold uppercase tracking-widest text-sm transition-all duration-200 hover:-translate-y-0.5
                                ${isOutOfStock
                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    : isAdding
                                        ? 'bg-zinc-900 text-white cursor-wait opacity-80'
                                        : 'bg-zinc-900 text-white hover:bg-zinc-800'
                                }
                            `}
                        >
                            {isAdding ? (locale === 'en' ? 'Adding...' : 'Ajout en cours...') : isOutOfStock ? (locale === 'en' ? 'Unavailable' : 'Indisponible') : (locale === 'en' ? 'Add to cart' : 'Ajouter au panier')}
                        </button>

                        <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                                {locale === 'en' ? 'Before you order' : 'Avant votre achat'}
                            </p>
                            <div className="mt-3 grid gap-2 text-[11px] font-semibold text-zinc-800">
                                {[
                                    locale === 'en' ? 'Prepared within 24-48h' : 'Préparation sous 24–48h',
                                    locale === 'en' ? 'France & international delivery' : 'Livraison France & international',
                                    locale === 'en' ? 'Tracked order' : 'Suivi de commande',
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mini Trust Badges */}
                        <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 py-2">
                            {[
                                { title: locale === 'en' ? 'Secure payment' : 'Paiement sécurisé', icon: 'payment' },
                                { title: locale === 'en' ? 'Quality guarantee' : 'Garantie qualité', icon: 'quality' },
                                { title: locale === 'en' ? 'Nosy-Be origin' : 'Origine Nosy-Be', icon: 'origin' }
                            ].map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center">
                                    {/* Using SVGs for cleaner look matching ProductActions */}
                                    <div className="mb-1 text-zinc-900 scale-75 origin-bottom">
                                        {idx === 0 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z" />
                                            </svg>
                                        )}
                                        {idx === 1 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" />
                                            </svg>
                                        )}
                                        {idx === 2 && (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-tighter leading-none">{badge.title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-2">
                            <Link
                                href={withLocale(`/produit/${product.slug}`, locale)}
                                className="inline-block text-[10px] text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                {locale === 'en' ? 'View full page' : 'Voir la page complète'}
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
