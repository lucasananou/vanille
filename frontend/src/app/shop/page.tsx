'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { CATALOG, ProductData } from '@/lib/products-data';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// Icons
const SearchIcon = () => (
    <svg className="w-5 h-5 text-vanilla-100/70" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
);

const TuneIcon = () => (
    <svg className="w-5 h-5 text-vanilla-50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4m16 0h-5m-6 8H4m16 0h-9m-5 8H4m16 0h-7" />
        <circle cx="15" cy="4" r="2" /><circle cx="11" cy="12" r="2" /><circle cx="13" cy="20" r="2" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6 text-vanilla-50" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

const VanillaIcon = () => (
    <svg className="w-6 h-6 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default function ShopPage() {
    const [search, setSearch] = useState('');
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedPack, setSelectedPack] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Dynamic values from CATALOG
    const allGrades = useMemo(() => Array.from(new Set(CATALOG.map(p => p.grade))), []);
    const allSizes = useMemo(() => Array.from(new Set(CATALOG.map(p => p.size))), []);
    const allPacks = useMemo(() => Array.from(new Set(CATALOG.flatMap(p => p.packaging))), []);

    const filteredProducts = useMemo(() => {
        let result = CATALOG.filter(p => {
            const matchesSearch = (p.title + p.subtitle).toLowerCase().includes(search.toLowerCase());
            const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(p.grade);
            const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
            const matchesPack = selectedPack.length === 0 || p.packaging.some(pk => selectedPack.includes(pk));
            return matchesSearch && matchesGrade && matchesSize && matchesPack;
        });

        if (sortBy === 'name_asc') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'name_desc') result = [...result].sort((a, b) => b.title.localeCompare(a.title));

        return result;
    }, [search, selectedGrades, selectedSizes, selectedPack, sortBy]);

    const toggleFilter = (list: string[], setList: (v: string[]) => void, value: string) => {
        if (list.includes(value)) setList(list.filter(v => v !== value));
        else setList([...list, value]);
    };

    const resetFilters = () => {
        setSelectedGrades([]);
        setSelectedSizes([]);
        setSelectedPack([]);
        setSearch('');
        setSortBy('featured');
    };

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main id="content" className="flex-grow">
                {/* HERO SECTION - Jungle Dark */}
                <section className="relative overflow-hidden bg-jungle-900">
                    <div className="absolute inset-0 shine grain opacity-40" aria-hidden="true"></div>

                    {/* Decorative halos */}
                    <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gold-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

                    <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 lg:pt-16 lg:pb-20">
                        <div className="grid lg:grid-cols-12 gap-10 items-end">
                            <div className="lg:col-span-7">
                                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-vanilla-50">
                                    <VanillaIcon />
                                    <span className="text-sm font-semibold uppercase tracking-widest">Nosy-Be • Madagascar</span>
                                </div>

                                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl italic leading-tight text-vanilla-50">
                                    La <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Boutique</span>
                                </h1>
                                <p className="mt-4 text-lg text-vanilla-100/80 max-w-xl">
                                    Sélectionnez vos gousses de vanille selon leur grade, leur taille et votre usage souhaité.
                                </p>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-3xl glass p-5 border border-vanilla-100/10">
                                    <div className="flex items-center gap-3 bg-jungle-950/50 rounded-2xl border border-vanilla-100/10 px-4 py-3 focus-within:ring-2 focus-within:ring-gold-500/20 transition-all">
                                        <SearchIcon />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une gousse..."
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
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="mt-1 w-full bg-jungle-950/50 border border-vanilla-100/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-500/20 transition-all text-vanilla-50"
                                            >
                                                <option className="bg-jungle-900" value="featured">Sélection MSV</option>
                                                <option className="bg-jungle-900" value="name_asc">Nom (A-Z)</option>
                                                <option className="bg-jungle-900" value="name_desc">Nom (Z-A)</option>
                                            </select>
                                        </div>
                                        <div className="sm:w-24 text-center sm:text-left">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-vanilla-100/40 ml-1">Résultats</label>
                                            <p className="mt-1 text-2xl font-display italic text-vanilla-50">{filteredProducts.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SHOP GRID SECTION - Light background */}
                <section className="bg-vanilla-50 text-jungle-900 transition-colors duration-500 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
                        <div className="grid lg:grid-cols-12 gap-12">

                            {/* SIDEBAR FILTERS - Desktop */}
                            <aside className="hidden lg:block lg:col-span-3 space-y-8">
                                <div className="sticky top-28 space-y-8">
                                    <div className="flex items-center justify-between pb-4 border-b border-vanilla-200">
                                        <h2 className="font-display text-xl italic">Filtres</h2>
                                        <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors">Réinitialiser</button>
                                    </div>

                                    {/* Filter Group: Grade */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">Grade</p>
                                        <div className="flex flex-col gap-3">
                                            {allGrades.map(grade => (
                                                <label key={grade} className="group flex items-center gap-3 cursor-pointer">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedGrades.includes(grade)}
                                                            onChange={() => toggleFilter(selectedGrades, setSelectedGrades, grade)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-5 h-5 rounded-lg border border-vanilla-300 bg-white group-hover:border-gold-500/50 transition-all peer-checked:bg-gold-500 peer-checked:border-gold-500"></div>
                                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                                    </div>
                                                    <span className="text-sm text-jungle-700 font-medium group-hover:text-jungle-950 transition-colors">{grade}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filter Group: Taille */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">Longueur</p>
                                        <div className="flex flex-col gap-3">
                                            {allSizes.map(size => (
                                                <label key={size} className="group flex items-center gap-3 cursor-pointer">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSizes.includes(size)}
                                                            onChange={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-5 h-5 rounded-lg border border-vanilla-300 bg-white group-hover:border-gold-500/50 transition-all peer-checked:bg-gold-500 peer-checked:border-gold-500"></div>
                                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                                    </div>
                                                    <span className="text-sm text-jungle-700 font-medium group-hover:text-jungle-950 transition-colors">{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filter Group: Format */}
                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">Conditionnement</p>
                                        <div className="flex flex-col gap-3">
                                            {allPacks.map(pack => (
                                                <label key={pack} className="group flex items-center gap-3 cursor-pointer">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPack.includes(pack)}
                                                            onChange={() => toggleFilter(selectedPack, setSelectedPack, pack)}
                                                            className="peer sr-only"
                                                        />
                                                        <div className="w-5 h-5 rounded-lg border border-vanilla-300 bg-white group-hover:border-gold-500/50 transition-all peer-checked:bg-gold-500 peer-checked:border-gold-500"></div>
                                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                                    </div>
                                                    <span className="text-sm text-jungle-700 font-medium group-hover:text-jungle-950 transition-colors">{pack}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-jungle-900 text-vanilla-50 border border-vanilla-100/10 relative overflow-hidden group">
                                        <div className="absolute inset-0 grain opacity-20 transition-opacity group-hover:opacity-30"></div>
                                        <p className="relative font-display text-xl italic text-vanilla-50">Besoin Pro ?</p>
                                        <p className="relative mt-2 text-xs text-vanilla-100/70">Volumes, fréquences, tarifs dégressifs.</p>
                                        <Link href="/b2b" className="relative mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-vanilla-50 transition-colors">
                                            Demande de devis
                                            <ArrowRightIcon />
                                        </Link>
                                    </div>
                                </div>
                            </aside>

                            {/* PRODUCT GRID */}
                            <div className="lg:col-span-9">
                                {/* Mobile Filter Trigger */}
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white border border-vanilla-200 px-6 py-4 font-semibold"
                                    >
                                        <TuneIcon />
                                        Filtres & Options
                                    </button>
                                </div>

                                {filteredProducts.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="inline-flex w-16 h-16 rounded-full bg-vanilla-100 items-center justify-center mb-6">
                                            <SearchIcon />
                                        </div>
                                        <h3 className="font-display text-2xl">Aucun résultat</h3>
                                        <p className="text-jungle-700/60 mt-2">Essayez de retirer certains filtres ou changez votre recherche.</p>
                                        <button onClick={resetFilters} className="mt-6 text-sm font-bold uppercase tracking-widest text-gold-600 hover:underline">Réinitialiser tout</button>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {filteredProducts.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/produit/${p.id}`}
                                                className="group rounded-[2rem] bg-white border border-vanilla-200 p-2 hover:border-gold-500/30 transition-all duration-500 overflow-hidden"
                                            >
                                                <div className="relative aspect-square rounded-[1.6rem] bg-vanilla-50 flex items-center justify-center overflow-hidden border border-vanilla-100">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-vanilla-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="transform group-hover:scale-110 transition-transform duration-700">
                                                        <VanillaIcon />
                                                    </div>
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-jungle-800 border border-vanilla-100">
                                                            {p.grade}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                        <h3 className="font-display text-xl text-jungle-950 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{p.title}</h3>
                                                        <span className="iconify text-gold-500" data-icon="mdi:arrow-top-right"></span>
                                                    </div>
                                                    <p className="text-sm text-jungle-700/70 line-clamp-1 mb-4">{p.subtitle}</p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-vanilla-100">
                                                        <p className="font-display text-xl text-jungle-950">
                                                            {p.price_label === '—' ? 'Sur demande' : (p.price_label === 'Devis' ? 'Prix Pro' : `${p.price_label}€`)}
                                                        </p>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 group-hover:translate-x-1 transition-transform">Voir gousse</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* MOBILE FILTER DRAWER */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-jungle-950/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                    <aside className="absolute bottom-0 left-0 right-0 bg-vanilla-50 rounded-t-[2.5rem] max-h-[90vh] flex flex-col border-t border-vanilla-200 animate-in slide-in-from-bottom duration-500">
                        <div className="p-6 flex items-center justify-between border-b border-vanilla-200">
                            <h2 className="font-display text-2xl italic text-jungle-900">Filtres</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-vanilla-100 flex items-center justify-center transition-transform hover:rotate-90">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-8 space-y-10">
                            {/* Grade Mobile */}
                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">Grade</p>
                                <div className="flex flex-wrap gap-3">
                                    {allGrades.map(grade => (
                                        <button
                                            key={grade}
                                            onClick={() => toggleFilter(selectedGrades, setSelectedGrades, grade)}
                                            className={`px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${selectedGrades.includes(grade)
                                                ? 'bg-jungle-900 border-jungle-900 text-vanilla-50'
                                                : 'bg-white border-vanilla-200 text-jungle-700 hover:bg-vanilla-100'
                                                }`}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Taille Mobile */}
                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">Longueur</p>
                                <div className="flex flex-wrap gap-3">
                                    {allSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                                            className={`px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${selectedSizes.includes(size)
                                                ? 'bg-jungle-900 border-jungle-900 text-vanilla-50'
                                                : 'bg-white border-vanilla-200 text-jungle-700 hover:bg-vanilla-100'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Format Mobile */}
                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">Conditionnement</p>
                                <div className="flex flex-wrap gap-3">
                                    {allPacks.map(pack => (
                                        <button
                                            key={pack}
                                            onClick={() => toggleFilter(selectedPack, setSelectedPack, pack)}
                                            className={`px-5 py-3 rounded-2xl border text-sm font-semibold transition-all ${selectedPack.includes(pack)
                                                ? 'bg-jungle-900 border-jungle-900 text-vanilla-50'
                                                : 'bg-white border-vanilla-200 text-jungle-700 hover:bg-vanilla-100'
                                                }`}
                                        >
                                            {pack}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pb-10 border-t border-vanilla-200 flex gap-4">
                            <button onClick={resetFilters} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest text-jungle-700 hover:text-gold-600 transition-colors">Réinitialiser</button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-[2] bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900 py-4 rounded-full font-bold"
                            >
                                Voir {filteredProducts.length} produits
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
