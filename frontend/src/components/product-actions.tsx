'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/types';

interface ProductActionsProps {
    product: Product;
    deliveryEstimate: string;
}

export default function ProductActions({ product, deliveryEstimate }: ProductActionsProps) {
    const { addItem, openCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isStickyVisible, setIsStickyVisible] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mock sizes if none provided - In real app, derived from product.variants
    const sizes = ['S', 'M', 'L', 'XL'];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky bar when main CTA is NOT intersecting (scrolled past)
                setIsStickyVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
            },
            { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
        );

        const mainCta = document.getElementById('main-add-to-cart');
        if (mainCta) {
            observer.observe(mainCta);
        }

        return () => observer.disconnect();
    }, []);

    const formatPrice = (price: number) => {
        return (price / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', '.') + ' €';
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError('Veuillez sélectionner une taille');
            setTimeout(() => setError(null), 3000);
            return;
        }
        setError(null);

        // Add item to cart with selected variant (mocking variant structure for now)
        addItem(product, 1, {
            id: `variant-${selectedSize}`,
            productId: product.id,
            sku: `${product.sku}-${selectedSize}`,
            title: `${product.title} - ${selectedSize}`,
            stock: product.stock,
            options: { Size: selectedSize },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        openCart();
    };

    return (
        <>
            {/* Desktop & Table Actions */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-[13px] font-semibold text-zinc-900">Taille</h3>
                        {error && <span className="text-[11px] text-red-600 font-bold animate-pulse">{error}</span>}
                    </div>
                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors font-medium underline underline-offset-4 decoration-zinc-200"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Guide des tailles — Échange gratuit si besoin
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-4">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => {
                                setSelectedSize(size);
                                setError(null);
                            }}
                            className={`w-12 h-12 flex items-center justify-center border text-[13px] transition-all rounded-sm ${selectedSize === size
                                ? 'border-zinc-900 bg-zinc-900 text-white font-bold shadow-sm'
                                : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-[12px] text-green-600 font-medium mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Retour facile si la taille ne convient pas</span>
                </div>
            </div>

            <div className="space-y-4">
                {deliveryEstimate && (
                    <div className="flex flex-col items-center justify-center py-4 px-4 bg-zinc-50 border border-zinc-100 rounded-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                        <p className="text-[12px] text-zinc-600 font-medium flex items-center gap-2.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>Livraison prévue <span className="text-zinc-900 font-bold">{deliveryEstimate}</span></span>
                        </p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        id="main-add-to-cart"
                        className={`flex-1 py-4 text-[13px] font-bold uppercase tracking-[0.1em] transition-all rounded-sm flex flex-col items-center justify-center gap-1 ${product.stock === 0
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg'
                            }`}
                    >
                        <span>{product.stock === 0 ? 'RUPTURE DE STOCK' : 'AJOUTER AU PANIER'}</span>
                        {selectedSize && <span className="text-[8px] font-medium normal-case tracking-normal opacity-70">Expédié sous 24h</span>}
                    </button>
                    <button className="w-14 h-14 flex flex-col items-center justify-center border border-zinc-100 text-zinc-400 hover:text-red-500 transition-all rounded-sm group">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-[8px] font-bold mt-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Sauvegarder</span>
                    </button>
                </div>

                <p className="text-[11px] text-center text-zinc-500 font-medium flex items-center justify-center gap-2">
                    <span className="opacity-70">💳 Paiement en 3x sans frais dès 80€</span>
                </p>

                <div className="flex items-center justify-center gap-2 text-[12px] text-zinc-600 font-medium pt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>En stock — <span className="text-zinc-900 font-semibold">expédié sous 24h</span></span>
                </div>

                {/* G. Trust Badges Section - Premium Redesign */}
                <div className="grid grid-cols-3 gap-6 pt-10 border-t border-zinc-100 mt-8">
                    {[
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            ),
                            title: 'Expédition 24h',
                            subtitle: 'Rapide & soigné'
                        },
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            ),
                            title: 'Retours 30j',
                            subtitle: 'Simple & gratuit'
                        },
                        {
                            icon: (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            ),
                            title: 'Paiement Sûr',
                            subtitle: 'Stripe Sécurisé'
                        }
                    ].map((badge, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-100 transition-transform group-hover:scale-105">
                                {badge.icon}
                            </div>
                            <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wide mb-1">{badge.title}</span>
                            <span className="text-[9px] text-zinc-400 font-light">{badge.subtitle}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Add to Cart (Mobile) */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-100 p-4 transition-transform duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] ${isStickyVisible ? 'translate-y-0' : 'translate-y-full'
                }`}>
                <div className="flex items-center gap-4 max-w-7xl mx-auto">
                    <div className="flex-1">
                        <div className="text-sm font-bold text-zinc-900">
                            {formatPrice(product.price)}
                        </div>
                        <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-none mt-1">
                            Retours 30 jours
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (!selectedSize) {
                                window.scrollTo({ top: 400, behavior: 'smooth' });
                                setError('Sélectionnez une taille');
                            } else {
                                handleAddToCart();
                            }
                        }}
                        className={`flex-[2] py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${'bg-zinc-900 text-white shadow-lg'
                            }`}
                    >
                        {selectedSize ? `Ajouter au panier (${selectedSize})` : 'Ajouter au panier'}
                    </button>
                </div>
            </div>

            {/* Size Guide Modal - Premium Redesign */}
            {isSizeGuideOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300" onClick={() => setIsSizeGuideOpen(false)}>
                    <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full p-10 relative animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-full transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-10">
                            <h3 className="font-serif text-3xl text-zinc-900 mb-2">Guide des tailles</h3>
                            <p className="text-zinc-500 text-sm">Trouvez la coupe parfaite pour vous</p>
                        </div>

                        <div className="overflow-hidden border border-zinc-100 rounded-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50/50 text-zinc-900 font-bold uppercase text-[10px] tracking-widest border-b border-zinc-100">
                                    <tr>
                                        <th className="px-6 py-4 font-serif text-xs normal-case tracking-normal text-zinc-500 font-normal">Taille</th>
                                        <th className="px-6 py-4 font-serif text-xs normal-case tracking-normal text-zinc-500 font-normal">FR</th>
                                        <th className="px-6 py-4 font-serif text-xs normal-case tracking-normal text-zinc-500 font-normal">Poitrine</th>
                                        <th className="px-6 py-4 font-serif text-xs normal-case tracking-normal text-zinc-500 font-normal">Taille</th>
                                        <th className="px-6 py-4 font-serif text-xs normal-case tracking-normal text-zinc-500 font-normal">Hanches</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 text-zinc-600 text-sm">
                                    {[
                                        { size: 'S', fr: '34-36', chest: '82-86', waist: '62-66', hips: '88-92' },
                                        { size: 'M', fr: '38-40', chest: '87-91', waist: '67-71', hips: '93-97' },
                                        { size: 'L', fr: '42-44', chest: '92-96', waist: '72-76', hips: '98-102' },
                                        { size: 'XL', fr: '46', chest: '97-101', waist: '77-81', hips: '103-107' }
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-50/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-zinc-900">{row.size}</td>
                                            <td className="px-6 py-4 text-zinc-500">{row.fr}</td>
                                            <td className="px-6 py-4 tabular-nums">{row.chest}</td>
                                            <td className="px-6 py-4 tabular-nums">{row.waist}</td>
                                            <td className="px-6 py-4 tabular-nums">{row.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex items-start gap-4 p-5 bg-zinc-50 rounded-sm border border-zinc-100">
                            <span className="text-xl">📏</span>
                            <div>
                                <h4 className="font-bold text-sm text-zinc-900 mb-1">Comment mesurer ?</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Utilisez un mètre ruban et tenez-le bien à plat.
                                    Si vous hésitez entre deux tailles, nous vous conseillons de prendre la <span className="font-semibold text-zinc-900">taille au-dessus</span> pour plus de confort.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
