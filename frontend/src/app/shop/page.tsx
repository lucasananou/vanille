'use client';

import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import type { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';
import { useLocale } from '@/lib/locale-context';
import { getLocalizedProduct } from '@/lib/localized-content';
import { withLocale } from '@/lib/i18n';
import { getWhatsappHref } from '@/lib/site';
import { CATALOG } from '@/lib/products-data';
import { normalizeProductRef } from '@/lib/product-refs';

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

type ShopProduct = Product & {
    uiGrade: string;
    uiSize: string;
    uiSubtitle: string;
    uiPackaging: string[];
    uiPriceLabel: string;
    uiOfferLines: string[];
    uiUnitLabel?: string;
    isRecommended?: boolean;
};

function formatPriceCents(price: number, locale: 'fr' | 'en') {
    return (price / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' });
}

function extractSize(product: Product) {
    const fromDetails = product.size;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(\d+\s*[–-]\s*\d+\s*cm|\d+\s*cm|Assorti|Volume)/i);
    return match?.[1] || product.options?.map((option) => option.values.join(' / ')).join(' • ') || 'Selection';
}

function extractGrade(product: Product) {
    const fromDetails = product.grade;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(TK\s*\(Noir\)|Gourmet|Noir|Assorti|Poivre Sauvage)/i);
    return match?.[1] || product.collection?.name || product.tags?.[0] || 'Selection';
}

function extractPackaging(product: Product) {
    if (product.options?.length) {
        return product.options.flatMap((option) => option.values).filter(Boolean);
    }
    if (product.packaging_options?.length) return product.packaging_options;
    return ['Vacuum-sealed'];
}

function extractSubtitle(product: Product) {
    const description = product.description || '';
    const firstLine = description.split(/\n+/).map((line) => line.trim()).find(Boolean);
    return firstLine || 'Premium vanilla selected in Nosy-Be.';
}

function getPriceLabel(product: Product, locale: 'fr' | 'en') {
    if (product.variants?.length) {
        const prices = product.variants
            .map((variant) => variant.price ?? product.price)
            .filter((price): price is number => typeof price === 'number');
        if (prices.length > 0) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min !== max) return `${locale === 'en' ? 'From' : 'À partir de'} ${(min / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}`;
            return (min / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' });
        }
    }
    return (product.price / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' });
}

function getVariantLabels(product: Product, locale: 'fr' | 'en') {
    return (product.variants || []).slice(0, 3).map((variant) => {
        const optionLabel = Object.values(variant.options || {}).filter(Boolean).join(' · ');
        const label = variant.title || optionLabel || (locale === 'en' ? 'Selected format' : 'Format sélectionné');
        const price = variant.price ?? product.price;
        return `${label} · ${formatPriceCents(price, locale)}`;
    });
}

function getUnitLabel(product: Product, locale: 'fr' | 'en') {
    const podVariant = (product.variants || []).find((variant) => /gousse/i.test(`${variant.title} ${Object.values(variant.options || {}).join(' ')}`));
    if (!podVariant) return undefined;

    const label = `${podVariant.title} ${Object.values(podVariant.options || {}).join(' ')}`;
    const match = label.match(/(\d+)\s*gousses?/i);
    const podCount = match ? Number(match[1]) : 0;
    const price = podVariant.price ?? product.price;
    if (!podCount || price <= 0) return undefined;

    return locale === 'en'
        ? `${formatPriceCents(Math.round(price / podCount), locale)} / pod`
        : `${formatPriceCents(Math.round(price / podCount), locale)} / gousse`;
}

function catalogToProducts(locale: 'fr' | 'en'): Product[] {
    return CATALOG.map((item) => {
        const slug = normalizeProductRef(item.id);
        const prices = (item.variants || []).map((variant) => variant.price).filter((price) => price > 0);
        const price = prices.length ? Math.min(...prices) : 0;
        const product: Product = {
            id: slug,
            title: item.title,
            description: item.description || [item.subtitle, ...item.bullets].join('\n'),
            sku: slug.toUpperCase(),
            slug,
            price,
            stock: 50,
            images: item.images,
            tags: [item.grade, item.size].filter(Boolean),
            published: true,
            createdAt: new Date(0).toISOString(),
            updatedAt: new Date(0).toISOString(),
            subtitle: item.subtitle,
            size: item.size,
            grade: item.grade,
            packaging_options: item.packaging,
            bullets: item.bullets,
            price_label: item.price_label,
            options: item.variants?.length ? [{
                id: `${slug}-format`,
                productId: slug,
                name: 'Format',
                values: item.variants.map((variant) => `${variant.packaging} · ${variant.quantity}`),
                position: 0,
            }] : [],
            variants: (item.variants || []).map((variant, index) => ({
                id: `${slug}-variant-${index}`,
                productId: slug,
                sku: `${slug}-${index + 1}`,
                title: `${variant.packaging} · ${variant.quantity}`,
                price: variant.price,
                stock: 50,
                options: { Format: `${variant.packaging} · ${variant.quantity}` },
                createdAt: new Date(0).toISOString(),
                updatedAt: new Date(0).toISOString(),
            })),
            averageRating: 0,
            reviewsCount: 0,
        };

        return getLocalizedProduct(product, locale);
    });
}

function toShopProduct(rawProduct: Product, locale: 'fr' | 'en', recommendedSlug: string): ShopProduct {
    const product = getLocalizedProduct(rawProduct, locale);
    const slug = normalizeProductRef(product.slug || product.id);

    return {
        ...product,
        slug,
        uiGrade: extractGrade(product),
        uiSize: extractSize(product),
        uiSubtitle: extractSubtitle(product),
        uiPackaging: extractPackaging(product),
        uiPriceLabel: getPriceLabel(product, locale),
        uiOfferLines: getVariantLabels(product, locale),
        uiUnitLabel: getUnitLabel(product, locale),
        isRecommended: slug === recommendedSlug,
    };
}

function getSeoCategory(product: ShopProduct, locale: 'fr' | 'en') {
    if (/poivre/i.test(product.title)) {
        return locale === 'en' ? 'Madagascar wild pepper' : 'Poivre sauvage de Madagascar';
    }
    return locale === 'en' ? 'Premium Madagascar Bourbon vanilla' : 'Vanille Bourbon Madagascar premium';
}

export default function ShopPage() {
    const { locale } = useLocale();
    const whatsappHref = getWhatsappHref(locale);
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [search, setSearch] = useState('');
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedPack, setSelectedPack] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<'featured' | 'name_asc' | 'name_desc'>('featured');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        setSearch(params.get('search') || '');
    }, []);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setNotice(null);

        const fallbackProducts = catalogToProducts(locale);
        const recommendedSlug = normalizeProductRef(fallbackProducts.find((product) => product.slug === 'pack-decouverte')?.slug || fallbackProducts[0]?.slug);

        try {
            const response = await productsApi.getProducts({ take: 100 });
            const apiProducts = response.data || [];

            if (apiProducts.length === 0) {
                setProducts(fallbackProducts.map((product) => toShopProduct(product, locale, recommendedSlug)));
                setNotice(locale === 'en'
                    ? 'The live catalogue is empty right now, so the MSV Nosy-Be reference selection remains available.'
                    : 'Le catalogue publié est vide pour le moment, la sélection de référence MSV Nosy-Be reste affichée.');
                return;
            }

            setProducts(apiProducts.map((product) => toShopProduct(product, locale, recommendedSlug)));
        } catch (err) {
            console.error('Failed to fetch shop products:', err);
            setProducts(fallbackProducts.map((product) => toShopProduct(product, locale, recommendedSlug)));
            setError(err instanceof Error ? err.message : locale === 'en' ? 'Unable to load the live shop.' : 'Impossible de charger la boutique en direct.');
            setNotice(locale === 'en'
                ? 'We are showing the reference catalogue so visitors can keep browsing.'
                : 'Le catalogue de référence reste affiché pour permettre la navigation.');
        } finally {
            setIsLoading(false);
        }
    }, [locale]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const allGrades = useMemo(() => Array.from(new Set(products.map((p) => p.uiGrade))), [products]);
    const allSizes = useMemo(() => Array.from(new Set(products.map((p) => p.uiSize))), [products]);
    const allPacks = useMemo(() => Array.from(new Set(products.flatMap((p) => p.uiPackaging))), [products]);

    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const haystack = `${p.title} ${p.uiSubtitle} ${p.description || ''}`.toLowerCase();
            const matchesSearch = haystack.includes(search.toLowerCase());
            const matchesGrade = selectedGrades.length === 0 || selectedGrades.includes(p.uiGrade);
            const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.uiSize);
            const matchesPack = selectedPack.length === 0 || p.uiPackaging.some((pack) => selectedPack.includes(pack));
            return matchesSearch && matchesGrade && matchesSize && matchesPack;
        });

        if (sortBy === 'name_asc') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === 'name_desc') result = [...result].sort((a, b) => b.title.localeCompare(a.title));

        return result;
    }, [products, search, selectedGrades, selectedSizes, selectedPack, sortBy]);

    const toggleFilter = (list: string[], setList: (v: string[]) => void, value: string) => {
        if (list.includes(value)) setList(list.filter((v) => v !== value));
        else setList([...list, value]);
    };

    const resetFilters = () => {
        setSelectedGrades([]);
        setSelectedSizes([]);
        setSelectedPack([]);
        setSearch('');
        setSortBy('featured');
    };

    const hasActiveFilters = search.trim() || selectedGrades.length > 0 || selectedSizes.length > 0 || selectedPack.length > 0;

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
                                    <VanillaIcon />
                                    <span className="text-sm font-semibold uppercase tracking-widest">Nosy-Be • Madagascar</span>
                                </div>

                                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl italic leading-tight text-vanilla-50">
                                    {locale === 'en' ? 'Shop our ' : 'Boutique '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">{locale === 'en' ? 'Madagascar vanilla' : 'vanille Madagascar'}</span>
                                </h1>
                                <p className="mt-4 text-lg text-vanilla-100/80 max-w-2xl">
                                    {locale === 'en'
                                        ? 'Discover our premium Bourbon vanilla pods, discovery sets and gift-ready formats, with a clear reading of grade, packaging and price.'
                                        : 'Retrouvez nos gousses de vanille Bourbon premium, packs découverte et formats cadeaux, avec une lecture simple du prix, du grade et du conditionnement.'}
                                </p>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-3xl glass p-5 border border-vanilla-100/10">
                                    <div className="flex items-center gap-3 bg-jungle-950/50 rounded-2xl border border-vanilla-100/10 px-4 py-3 focus-within:ring-2 focus-within:ring-gold-500/20 transition-all">
                                        <SearchIcon />
                                        <input
                                            type="text"
                                            placeholder={locale === 'en' ? 'Search for a pod...' : 'Rechercher une gousse...'}
                                            className="w-full bg-transparent outline-none text-sm placeholder:text-vanilla-100/40 text-vanilla-50"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-vanilla-100/40 ml-1">{locale === 'en' ? 'Sort by' : 'Trier par'}</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                                className="mt-1 w-full bg-jungle-950/50 border border-vanilla-100/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-500/20 transition-all text-vanilla-50"
                                            >
                                                <option className="bg-jungle-900" value="featured">{locale === 'en' ? 'MSV Nosy-Be selection' : 'Sélection M.S.V-NOSY BE'}</option>
                                                <option className="bg-jungle-900" value="name_asc">{locale === 'en' ? 'Name (A-Z)' : 'Nom (A-Z)'}</option>
                                                <option className="bg-jungle-900" value="name_desc">{locale === 'en' ? 'Name (Z-A)' : 'Nom (Z-A)'}</option>
                                            </select>
                                        </div>
                                        <div className="sm:w-24 text-center sm:text-left">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-vanilla-100/40 ml-1">{locale === 'en' ? 'Results' : 'Résultats'}</label>
                                            <p className="mt-1 text-2xl font-display italic text-vanilla-50">{isLoading ? '...' : filteredProducts.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                            <div className="rounded-3xl border border-vanilla-100/10 bg-white/5 p-5 text-vanilla-50">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-500">
                                    {locale === 'en' ? 'Shop reassurance' : 'Reassurance boutique'}
                                </p>
                                <p className="mt-3 text-sm text-vanilla-100/80">
                                    {locale === 'en'
                                        ? 'Each product page highlights grade, size, packaging and shipping guidance so visitors can compare formats without friction.'
                                        : 'Chaque fiche met en avant le grade, la longueur, le conditionnement et les infos de livraison pour comparer les formats sans hésiter.'}
                                </p>
                            </div>
                            <div className="rounded-3xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 text-vanilla-50">
                                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7CFFB0]">
                                    {locale === 'en' ? 'Need help choosing?' : 'Besoin d’aide pour choisir ?'}
                                </p>
                                <p className="mt-3 text-sm text-vanilla-100/80">
                                    {locale === 'en'
                                        ? 'Ask us directly about the right grade, delivery timing or a trade request before ordering.'
                                        : 'Posez votre question sur le bon grade, le délai de livraison ou une demande pro avant de commander.'}
                                </p>
                                {whatsappHref ? (
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                    >
                                        {locale === 'en' ? 'Open WhatsApp' : 'Ouvrir WhatsApp'}
                                        <ArrowRightIcon />
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 text-jungle-900 transition-colors duration-500 min-h-screen">
                    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <aside className="hidden lg:block lg:col-span-3 space-y-8">
                                <div className="sticky top-28 space-y-8">
                                    <div className="flex items-center justify-between pb-4 border-b border-vanilla-200">
                                        <h2 className="font-display text-xl italic">{locale === 'en' ? 'Filters' : 'Filtres'}</h2>
                                        <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors">{locale === 'en' ? 'Reset' : 'Réinitialiser'}</button>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Grade' : 'Grade'}</p>
                                        <div className="flex flex-col gap-3">
                                            {allGrades.map((grade) => (
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

                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Length' : 'Longueur'}</p>
                                        <div className="flex flex-col gap-3">
                                            {allSizes.map((size) => (
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

                                    <div className="space-y-4">
                                        <p className="text-sm font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Packaging' : 'Conditionnement'}</p>
                                        <div className="flex flex-col gap-3">
                                            {allPacks.map((pack) => (
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
                                        <p className="relative font-display text-xl italic text-vanilla-50">{locale === 'en' ? 'Trade enquiry?' : 'Besoin Pro ?'}</p>
                                        <p className="relative mt-2 text-xs text-vanilla-100/70">{locale === 'en' ? 'Volumes, delivery cadence and preferential rates.' : 'Volumes, fréquences, tarifs dégressifs.'}</p>
                                        <Link href={withLocale('/b2b', locale)} className="relative mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:text-vanilla-50 transition-colors">
                                            {locale === 'en' ? 'Request a quote' : 'Demande de devis'}
                                            <ArrowRightIcon />
                                        </Link>
                                    </div>
                                </div>
                            </aside>

                            <div className="lg:col-span-9">
                                <div className="lg:hidden mb-6">
                                    <button
                                        onClick={() => setIsFilterOpen(true)}
                                        className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white border border-vanilla-200 px-6 py-4 font-semibold"
                                    >
                                        <TuneIcon />
                                        {locale === 'en' ? 'Filters & options' : 'Filtres & Options'}
                                    </button>
                                </div>

                                {(notice || error) && !isLoading ? (
                                    <div className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${error ? 'border-gold-200 bg-gold-50 text-jungle-900' : 'border-vanilla-200 bg-white text-jungle-800'}`}>
                                        <p className="font-semibold">{notice || error}</p>
                                        {error ? (
                                            <div className="mt-3 flex flex-wrap gap-3">
                                                <button onClick={loadProducts} className="rounded-full bg-jungle-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-vanilla-50">
                                                    {locale === 'en' ? 'Retry' : 'Réessayer'}
                                                </button>
                                                <button onClick={resetFilters} className="rounded-full border border-jungle-900/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-jungle-800">
                                                    {locale === 'en' ? 'Reset filters' : 'Réinitialiser les filtres'}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                ) : null}

                                {isLoading ? (
                                    <div className="py-20 text-center">
                                        <div className="inline-flex w-16 h-16 rounded-full bg-vanilla-100 items-center justify-center mb-6 animate-pulse">
                                            <SearchIcon />
                                        </div>
                                        <p className="text-jungle-700/60">{locale === 'en' ? 'Loading the shop…' : 'Chargement de la boutique…'}</p>
                                    </div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="inline-flex w-16 h-16 rounded-full bg-vanilla-100 items-center justify-center mb-6">
                                            <SearchIcon />
                                        </div>
                                        <h3 className="font-display text-2xl">{hasActiveFilters ? (locale === 'en' ? 'No matching product' : 'Aucun produit correspondant') : (locale === 'en' ? 'No published product' : 'Aucun produit publié')}</h3>
                                        <p className="text-jungle-700/60 mt-2">{hasActiveFilters ? (locale === 'en' ? 'Try removing some filters or changing your search.' : 'Essayez de retirer certains filtres ou changez votre recherche.') : (locale === 'en' ? 'The catalogue is temporarily unavailable.' : 'Le catalogue est temporairement indisponible.')}</p>
                                        <button onClick={resetFilters} className="mt-6 text-sm font-bold uppercase tracking-widest text-gold-600 hover:underline">{locale === 'en' ? 'Reset all' : 'Réinitialiser tout'}</button>
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {filteredProducts.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={withLocale(`/produit/${p.slug}`, locale)}
                                                className="group rounded-[2rem] bg-white border border-vanilla-200 p-2 hover:border-gold-500/30 transition-all duration-500 overflow-hidden"
                                            >
                                                <div className="relative aspect-square rounded-[1.6rem] bg-vanilla-50 flex items-center justify-center overflow-hidden border border-vanilla-100">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-vanilla-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <Image
                                                        src={getImageUrl(p.images[0])}
                                                        alt={`${getSeoCategory(p, locale)} - ${p.title}`}
                                                        className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-jungle-800 border border-vanilla-100">
                                                            {p.uiGrade}
                                                        </span>
                                                    </div>
                                                    {p.isRecommended ? (
                                                        <div className="absolute bottom-4 left-4">
                                                            <span className="bg-gold-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-jungle-900 shadow-sm">
                                                                {locale === 'en' ? 'Recommended pack' : 'Pack recommandé'}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="p-5">
                                                    <div className="flex items-center justify-between gap-4 mb-2">
                                                        <h3 className="font-display text-xl text-jungle-950 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{p.title}</h3>
                                                        <span className="text-gold-500"><ArrowRightIcon /></span>
                                                    </div>
                                                    <p className="text-sm text-jungle-700/70 line-clamp-1 mb-4">{p.uiSubtitle}</p>
                                                    {typeof p.averageRating === 'number' && typeof p.reviewsCount === 'number' && p.reviewsCount > 0 ? (
                                                        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-[11px] font-bold text-jungle-900">
                                                            <svg className="h-3.5 w-3.5 text-gold-600" viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                            {p.averageRating.toFixed(1)}/5 · {p.reviewsCount} {locale === 'en' ? 'reviews' : 'avis'}
                                                        </div>
                                                    ) : null}
                                                    <div className="mb-4 flex flex-wrap gap-2">
                                                        <span className="rounded-full bg-vanilla-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-jungle-700">
                                                            {p.uiSize}
                                                        </span>
                                                        <span className="rounded-full bg-gold-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-700">
                                                            {p.uiPackaging.slice(0, 2).join(' / ')}
                                                        </span>
                                                    </div>
                                                    {p.uiOfferLines.length > 0 ? (
                                                        <div className="mb-4 space-y-2 rounded-2xl border border-vanilla-200 bg-vanilla-50 p-3">
                                                            {p.uiOfferLines.map((line) => (
                                                                <p key={line} className="text-xs font-semibold text-jungle-800">{line}</p>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    <div className="flex items-center justify-between pt-4 border-t border-vanilla-100">
                                                        <div>
                                                            <p className="font-display text-xl text-jungle-950">{p.uiPriceLabel}</p>
                                                            {p.uiUnitLabel ? <p className="mt-1 text-[11px] font-semibold text-jungle-500">{p.uiUnitLabel}</p> : null}
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 group-hover:translate-x-1 transition-transform">{locale === 'en' ? 'Details' : 'Détails'}</span>
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

            {isFilterOpen && (
                <div className="fixed inset-0 z-[60] overflow-hidden">
                    <div className="absolute inset-0 bg-jungle-950/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                    <aside className="absolute bottom-0 left-0 right-0 bg-vanilla-50 rounded-t-[2.5rem] max-h-[90vh] flex flex-col border-t border-vanilla-200 animate-in slide-in-from-bottom duration-500">
                        <div className="p-6 flex items-center justify-between border-b border-vanilla-200">
                            <h2 className="font-display text-2xl italic text-jungle-900">{locale === 'en' ? 'Filters' : 'Filtres'}</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="w-10 h-10 rounded-full bg-vanilla-100 flex items-center justify-center transition-transform hover:rotate-90">
                                <CloseIcon />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-8 space-y-10">
                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Grade' : 'Grade'}</p>
                                <div className="flex flex-wrap gap-3">
                                    {allGrades.map((grade) => (
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

                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Length' : 'Longueur'}</p>
                                <div className="flex flex-wrap gap-3">
                                    {allSizes.map((size) => (
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

                            <div className="space-y-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-jungle-800">{locale === 'en' ? 'Packaging' : 'Conditionnement'}</p>
                                <div className="flex flex-wrap gap-3">
                                    {allPacks.map((pack) => (
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
                            <button onClick={resetFilters} className="flex-1 py-4 text-sm font-bold uppercase tracking-widest text-jungle-700 hover:text-gold-600 transition-colors">{locale === 'en' ? 'Reset' : 'Réinitialiser'}</button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-[2] bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900 py-4 rounded-full font-bold"
                            >
                                {locale === 'en' ? `View ${filteredProducts.length} products` : `Voir ${filteredProducts.length} produits`}
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}
