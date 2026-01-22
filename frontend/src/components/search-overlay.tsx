'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { productsApi } from '@/lib/api/products';
import type { Product } from '@/lib/types';


interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Simple debounce implementation since I'm not sure if the hook exists
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle Search
    useEffect(() => {
        const search = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await productsApi.searchProducts(debouncedQuery);
                // Limit to 4-6 top results for the dropdown feel
                setResults(response.data.slice(0, 6));
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        search();
    }, [debouncedQuery]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.length > 0) {
            onClose();
            router.push(`/store/products?search=${encodeURIComponent(query)}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white/95 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Header / Input Area */}
            <div className="w-full border-b border-zinc-100 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-28 flex items-center gap-6">
                    <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-4">
                        <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher une robe, une jupe..."
                            className="w-full text-2xl md:text-4xl font-serif text-zinc-900 placeholder:text-zinc-300 bg-transparent border-transparent focus:border-transparent focus:ring-0 p-0 outline-none shadow-none ring-0 appearance-none"
                        />
                        {isLoading && (
                            <div className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                        )}
                    </form>

                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-7xl mx-auto">

                    {/* Empty State / Suggestions */}
                    {query.length === 0 && (
                        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 delay-100">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Populaire</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['Robe longue', 'Jupe plissée', 'Veste noire', 'Nouveautés'].map(term => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="px-6 py-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-zinc-200"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Catégories</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { name: 'Robes', slug: 'robe-tsniout', href: '/robe-tsniout' },
                                        { name: 'Jupes', slug: 'jupe-longue-tsniout', href: '/jupe-longue-tsniout' },
                                        { name: 'Hauts', slug: 'chemisier', href: '/chemisier' },
                                        { name: 'Accessoires', slug: 'collier', href: '/collier' },
                                    ].map((cat) => (
                                        <CategoryTile key={cat.slug} category={cat} onClose={onClose} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Results */}
                    {query.length > 0 && results.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                Résultats pour &quot;<span className="text-zinc-900">{query}</span>&quot;
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/produit/${product.slug}`}
                                        onClick={onClose}
                                        className="group block"
                                    >
                                        <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden mb-3 rounded-sm">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-zinc-300 text-xs">No Image</div>
                                            )}
                                        </div>
                                        <h4 className="text-sm font-medium text-zinc-900 group-hover:underline decoration-zinc-200 underline-offset-4 line-clamp-1">
                                            {product.title}
                                        </h4>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            {(product.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            <div className="flex justify-center pt-8 border-t border-zinc-100">
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-zinc-800 transition-all"
                                >
                                    Voir tous les résultats ({results.length}+)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {query.length > 0 && !isLoading && results.length === 0 && debouncedQuery.length >= 2 && (
                        <div className="text-center py-20">
                            <p className="text-zinc-400 text-lg font-light mb-4">Aucun résultat trouvé pour &quot;{query}&quot;</p>
                            <p className="text-zinc-500 text-sm">Essayez avec un autre mot-clé ou parcourez nos catégories.</p>
                            <Link
                                href="/produit"
                                onClick={onClose}
                                className="inline-block mt-8 text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-all"
                            >
                                Voir toute la boutique
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CategoryTile({ category, onClose }: { category: { name: string, slug: string, href: string }, onClose: () => void }) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await productsApi.getProducts({ collection: category.slug, limit: 1 });
                if (res.data && res.data.length > 0 && res.data[0].images && res.data[0].images.length > 0) {
                    setImage(res.data[0].images[0]);
                }
            } catch (err) {
                console.error(`Failed to fetch image for ${category.name}`, err);
            }
        };
        fetchImage();
    }, [category.slug]);

    return (
        <Link
            href={category.href}
            onClick={onClose}
            className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-zinc-50 shadow-sm hover:shadow-md transition-all"
        >
            {image ? (
                <Image
                    src={image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center text-zinc-300">
                    {/* Clean placeholder while loading, no text to avoid clutter */}
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-10">
                <span className="text-white font-bold uppercase tracking-wider text-sm md:text-base border-b-2 border-transparent group-hover:border-white transition-all pb-1 shadow-sm">
                    {category.name}
                </span>
            </div>
        </Link>
    );
}
