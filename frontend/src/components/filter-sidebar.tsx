'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    inStockOnly: boolean;
    setInStockOnly: (inStock: boolean) => void;
    selectedSizes: string[];
    setSelectedSizes: Dispatch<SetStateAction<string[]>>;
    totalProducts: number;
}

const SIZES = ['S', 'M', 'L', 'XL', 'Taille Unique'];
const COLORS = [
    { label: 'Noir', count: 20, value: 'black', hex: '#000000' },
    { label: 'Blanc', count: 15, value: 'white', hex: '#FFFFFF' },
    { label: 'Beige', count: 7, value: 'beige', hex: '#F5F5DC' },
    { label: 'Vert', count: 10, value: 'green', hex: '#008000' },
    { label: 'Bleu', count: 2, value: 'blue', hex: '#0000FF' },
    { label: 'Rose', count: 6, value: 'pink', hex: '#FFC0CB' },
];

export default function FilterSidebar({
    isOpen,
    setIsOpen,
    activeFilter,
    setActiveFilter,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    selectedSizes,
    setSelectedSizes,
    totalProducts
}: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Sync state with URL params on mount
    useEffect(() => {
        if (!isOpen) return;

        const stock = searchParams.get('stock');
        if (stock === 'true') setInStockOnly(true);

        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');
        if (min || max) {
            setPriceRange({
                min: min ? parseInt(min) : 0,
                max: max ? parseInt(max) : 2000
            });
        }

        const sizes = searchParams.get('sizes');
        if (sizes) {
            setSelectedSizes(sizes.split(','));
        }
    }, [isOpen, searchParams, setInStockOnly, setPriceRange, setSelectedSizes]);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (inStockOnly) params.set('stock', 'true');
        if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
        if (priceRange.max < 2000) params.set('maxPrice', priceRange.max.toString());
        if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));

        // Push interactions to URL without refreshing (shallow routing in Next.js App Router works by default with router.push)
        // However, we want to apply to parent. For now, since state is lifted, we just close.
        // Ideally, the parent should own the URL update, but we can do it here for "Applying".

        // Actually, let's keep it simple: We update the URL to reflect the current state when "Appliquer" is clicked.
        // The parent component should probably be listening to URL changes or we just update the URL and the parent (which is client-side) will re-render if it was using searchParams.
        // But currently the parent uses local state. Let's just update the URL as a "side effect" of applying for now, so shareable links work.

        router.push(`?${params.toString()}`, { scroll: false });
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            <aside className="relative w-[400px] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-900">Filtres</h2>
                        <p className="text-xs text-zinc-500 mt-1">Affinez votre recherche ({totalProducts} produits)</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Stock Toggle */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-l-2 border-zinc-900 pl-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Disponibilité</h3>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zinc-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
                            </div>
                            <span className="text-sm text-zinc-600 font-medium">Uniquement en stock</span>
                        </label>
                    </div>

                    <hr className="border-t border-zinc-100" />

                    {/* Price */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-l-2 border-zinc-900 pl-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Prix</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Min (€)</label>
                                <input
                                    type="number"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Max (€)</label>
                                <input
                                    type="number"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                                    className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-zinc-100" />

                    {/* Sizes */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-l-2 border-zinc-900 pl-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Tailles</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                                    className={`min-w-[40px] h-10 px-3 flex items-center justify-center text-sm border transition-all ${selectedSizes.includes(size)
                                        ? 'bg-zinc-900 border-zinc-900 text-white font-bold'
                                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-t border-zinc-100" />

                    {/* Colors */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 border-l-2 border-zinc-900 pl-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Couleurs</h3>
                        </div>
                        <div className="space-y-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color.label}
                                    className={`w-full flex items-center justify-between px-4 py-3 border rounded text-sm transition-all bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-5 h-5 rounded-full border border-zinc-100 shadow-sm"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span>{color.label}</span>
                                    </div>
                                    <span className="text-xs text-zinc-400">({color.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="border-t border-zinc-100 p-6 flex gap-4 bg-white/50 backdrop-blur-md sticky bottom-0">
                    <button
                        onClick={() => {
                            setInStockOnly(false);
                            setPriceRange({ min: 0, max: 2000 });
                            setSelectedSizes([]);
                            setActiveFilter('all');
                        }}
                        className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        Effacer
                    </button>
                    <button
                        onClick={applyFilters}
                        className="flex-[2] bg-zinc-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg"
                    >
                        Appliquer
                    </button>
                </div>
            </aside>
        </div>
    );
}
