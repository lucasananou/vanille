'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { productsApi } from '@/lib/api/products';
import type { Product } from '@/lib/types';

const SearchIcon = () => (
    <svg className="w-5 h-5 text-vanilla-100/70" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const initialSearch = params.get('search') || '';
        setSearch(initialSearch);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await productsApi.getProducts({
                    search: search || undefined,
                    sort: sortBy,
                    take: 100,
                });
                setProducts(response.data || []);
            } catch (err) {
                console.error('Failed to fetch shop products:', err);
                setError(err instanceof Error ? err.message : 'Impossible de charger la boutique.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [search, sortBy]);

    const productCountLabel = useMemo(() => `${products.length} produit${products.length > 1 ? 's' : ''}`, [products.length]);

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main id="content" className="flex-grow">
                <section className="relative overflow-hidden bg-jungle-900">
                    <div className="absolute inset-0 shine grain opacity-40" aria-hidden="true"></div>
                    <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gold-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

                    <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 lg:pt-16 lg:pb-20">
                        <div className="grid lg:grid-cols-12 gap-10 items-end">
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-vanilla-50">
                                    <span className="text-sm font-semibold uppercase tracking-widest">Nosy-Be • Madagascar</span>
                                </div>

                                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl italic leading-tight text-vanilla-50">
                                    La <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Boutique</span>
                                </h1>
                                <p className="mt-4 text-lg text-vanilla-100/80 max-w-xl">
                                    Catalogue synchronisé avec l'administration. Nouveaux produits, prix, stock et variantes remontent ici sans recopie manuelle.
                                </p>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-3xl glass p-5 border border-vanilla-100/10">
                                    <div className="flex items-center gap-3 bg-jungle-950/50 rounded-2xl border border-vanilla-100/10 px-4 py-3 focus-within:ring-2 focus-within:ring-gold-500/20 transition-all">
                                        <SearchIcon />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un produit..."
                                            className="w-full bg-transparent outline-none text-sm placeholder:text-vanilla-100/40 text-vanilla-50"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-vanilla-100/40 ml-1">Trier par</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                                className="mt-1 w-full bg-jungle-950/50 border border-vanilla-100/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-500/20 transition-all text-vanilla-50"
                                            >
                                                <option className="bg-jungle-900" value="featured">Sélection M.S.V-NOSY BE</option>
                                                <option className="bg-jungle-900" value="newest">Nouveautés</option>
                                                <option className="bg-jungle-900" value="price-asc">Prix croissant</option>
                                                <option className="bg-jungle-900" value="price-desc">Prix décroissant</option>
                                            </select>
                                        </div>
                                        <div className="sm:w-32 text-center sm:text-left">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-vanilla-100/40 ml-1">Catalogue</label>
                                            <p className="mt-1 text-2xl font-display italic text-vanilla-50">{products.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 text-jungle-900 transition-colors duration-500 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-500">Source de vérité</p>
                            </div>
                            <p className="text-sm text-cacao-600 font-medium">{productCountLabel}</p>
                        </div>

                        {isLoading && (
                            <div className="flex justify-center py-24">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-600 border-t-transparent"></div>
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="rounded-[32px] bg-white border border-red-100 p-10 text-center text-red-600">
                                <p className="font-semibold">Impossible de charger la boutique.</p>
                                <p className="mt-2 text-sm">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && products.length === 0 && (
                            <div className="rounded-[32px] bg-white border border-cacao-900/5 p-10 text-center">
                                <p className="font-display text-2xl italic text-jungle-950">Aucun produit trouvé</p>
                                <p className="mt-3 text-cacao-600">Affinez votre recherche ou réessayez avec un autre mot-clé.</p>
                                <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-6 py-3 text-sm font-bold text-vanilla-50">
                                    Réinitialiser
                                    <ArrowRightIcon />
                                </Link>
                            </div>
                        )}

                        {!isLoading && !error && products.length > 0 && (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
