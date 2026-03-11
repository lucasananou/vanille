'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import type { Product, ProductVariant } from '@/lib/types';
import { productsApi } from '@/lib/api/products';
import { normalizeProductRef } from '@/lib/product-refs';
import { getImageUrl } from '@/lib/utils';

const CheckIcon = () => (
    <svg className="w-4 h-4 text-gold-500 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

function getVariantOptions(product: Product) {
    return product.options || [];
}

function findMatchingVariant(product: Product, selectedOptions: Record<string, string>) {
    if (!product.variants?.length) return null;
    return product.variants.find((variant) => {
        const variantOptions = (variant.options || {}) as Record<string, string>;
        return Object.entries(selectedOptions).every(([key, value]) => variantOptions[key] === value);
    }) || null;
}

function extractGrade(product: Product) {
    const fromDetails = (product.details as any)?.grade;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(TK\s*\(Noir\)|Gourmet|Noir|Assorti|Poivre Sauvage)/i);
    return match?.[1] || product.collection?.name || product.tags?.[0] || 'Sélection';
}

function extractSize(product: Product) {
    const fromDetails = (product.details as any)?.size;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(\d+\s*[–-]\s*\d+\s*cm|\d+\s*cm|Assorti|Volume)/i);
    return match?.[1] || 'Sélection';
}

function getUiPackaging(product: Product, currentVariant: ProductVariant | null) {
    const variantOptions = currentVariant?.options as Record<string, string> | undefined;
    if (variantOptions) {
        const firstOption = Object.values(variantOptions)[0];
        if (firstOption) return firstOption;
    }
    const option = product.options?.[0];
    return option?.values?.[0] || 'Sous-vide';
}

function getDescriptionParagraphs(product: Product) {
    return (product.description || '').split(/\n+/).map((text) => text.trim()).filter(Boolean);
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const slug = normalizeProductRef(id);
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { addItem, openCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productsApi.getProductBySlug(slug);
                setProduct(response);
                setSelectedImageIndex(0);
                const initialOptions = (response.options || []).reduce<Record<string, string>>((acc, option) => {
                    if (option.values.length > 0) acc[option.name] = option.values[0];
                    return acc;
                }, {});
                setSelectedOptions(initialOptions);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(err instanceof Error ? err.message : 'Produit non trouvé');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const selectedVariant = useMemo(() => product ? findMatchingVariant(product, selectedOptions) : null, [product, selectedOptions]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-vanilla-50 font-sans antialiased text-jungle-900">
                <div className="bg-jungle-900 border-b border-vanilla-100/10"><Header /></div>
                <main className="flex-grow flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-600 border-t-transparent"></div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen bg-vanilla-50 font-sans antialiased text-jungle-900">
                <div className="bg-jungle-900 border-b border-vanilla-100/10"><Header /></div>
                <main className="flex-grow flex items-center justify-center px-4 text-center">
                    <div>
                        <h1 className="font-display text-4xl italic">Produit non trouvé</h1>
                        <p className="mt-3 text-jungle-700/70">{error || 'Cette fiche produit n’est plus disponible.'}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const currentPrice = selectedVariant?.price ?? product.price;
    const isOnRequest = currentPrice <= 0;
    const stock = selectedVariant?.stock ?? product.stock;
    const productGrade = extractGrade(product);
    const productSize = extractSize(product);
    const packagingLabel = getUiPackaging(product, selectedVariant);
    const descriptionParagraphs = getDescriptionParagraphs(product);

    const handleAddToCart = () => {
        if (stock <= 0) return;
        addItem(product, qty, selectedVariant || undefined);
        openCart();
    };

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 font-sans antialiased text-jungle-900">
            <div className="bg-jungle-900 border-b border-vanilla-100/10">
                <Header />
            </div>

            <main id="content" className="flex-grow">
                <section className="relative overflow-hidden bg-vanilla-50 transition-colors duration-500 pb-16">
                    <div className="absolute inset-0 grain opacity-20 pointer-events-none" aria-hidden="true"></div>
                    <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gold-500/5 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

                    <div className="relative mx-auto max-w-7xl px-4 pt-10">
                        <nav aria-label="Fil d'ariane" className="text-sm text-jungle-700/60">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link className="hover:text-gold-600 focus-ring rounded-full px-2 py-1 transition-colors" href="/">Accueil</Link></li>
                                <li className="opacity-40">/</li>
                                <li><Link className="hover:text-gold-600 focus-ring rounded-full px-2 py-1 transition-colors" href="/shop">Boutique</Link></li>
                                <li className="opacity-40">/</li>
                                <li className="text-jungle-950 font-semibold">{product.title}</li>
                            </ol>
                        </nav>

                        <div className="mt-8 grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-7">
                                <div className="rounded-[2.5rem] border border-vanilla-200 bg-white overflow-hidden">
                                    <div className="aspect-[4/3] relative bg-vanilla-100/30 flex items-center justify-center">
                                        <img
                                            src={getImageUrl(product.images[selectedImageIndex] || product.images[0])}
                                            alt={product.title}
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-white/80 border border-vanilla-200 backdrop-blur text-jungle-800">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                                                {productGrade}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900">
                                                Premium
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-vanilla-100">
                                        <div className="grid grid-cols-4 gap-4">
                                            {product.images.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedImageIndex(i)}
                                                    className="rounded-2xl bg-vanilla-50 border border-vanilla-200 overflow-hidden focus-ring aspect-square flex items-center justify-center hover:bg-white hover:border-gold-500/30 transition-all"
                                                >
                                                    <img
                                                        src={getImageUrl(img)}
                                                        alt={`${product.title} - view ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-[2.5rem] bg-white border border-vanilla-200 p-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 grain opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity"></div>

                                    <div className="inline-flex items-center gap-2 rounded-full bg-vanilla-100 px-4 py-2 text-xs font-semibold text-jungle-800 border border-vanilla-200">
                                        <svg className="w-3.5 h-3.5 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        Nosy-Be • Madagascar
                                    </div>

                                    <h1 className="mt-6 font-display text-4xl leading-[1.06] text-jungle-950 italic">{product.title}</h1>
                                    <p className="mt-3 text-lg text-jungle-700/70 leading-relaxed font-medium">{descriptionParagraphs[0] || product.collection?.name || 'Vanille premium de Madagascar'}</p>

                                    <div className="mt-8 flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">Prix de la sélection</p>
                                            <div className="flex items-end gap-3 mt-1">
                                                <p className="text-4xl font-semibold text-jungle-950">
                                                    {isOnRequest ? 'Sur demande' : `${(currentPrice / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-vanilla-50 border border-vanilla-200 p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 text-center">Disponibilité</p>
                                            <p className="text-sm font-semibold text-gold-600 mt-1">{stock > 0 ? 'En stock' : 'Épuisé'}</p>
                                        </div>
                                    </div>

                                    {getVariantOptions(product).length > 0 && (
                                        <div className="mt-8">
                                            <p className="text-sm font-bold uppercase tracking-widest text-jungle-400 ml-1">Options de sélection</p>
                                            <div className="mt-3 space-y-4">
                                                {getVariantOptions(product).map((option) => (
                                                    <div key={option.id}>
                                                        <p className="text-xs font-semibold uppercase tracking-widest text-jungle-500 mb-2">{option.name}</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {option.values.map((value) => {
                                                                const selected = selectedOptions[option.name] === value;
                                                                return (
                                                                    <button
                                                                        key={value}
                                                                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                                                                        className={`inline-flex flex-col items-start justify-center gap-1 rounded-2xl px-5 py-4 text-sm font-bold border transition-all ${selected
                                                                            ? 'bg-jungle-900 text-vanilla-50 border-jungle-900'
                                                                            : 'bg-vanilla-50 border-vanilla-200 text-jungle-700 hover:bg-white hover:border-gold-500/30'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span className="truncate">{value}</span>
                                                                            {selected && <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                                                                        </div>
                                                                        {selectedVariant && selected && (
                                                                            <div className={`text-[11px] font-medium ${selected ? 'text-vanilla-100/60' : 'text-jungle-700/50'}`}>
                                                                                {(selectedVariant.price ?? currentPrice) / 100}€
                                                                            </div>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">Quantité</label>
                                            <div className="mt-2 inline-flex w-full items-center justify-between rounded-full bg-vanilla-100 border border-vanilla-200 p-1">
                                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-full grid place-items-center hover:bg-white transition-all transition-colors active:scale-90">−</button>
                                                <span className="text-sm font-bold text-jungle-900">{qty}</span>
                                                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-full grid place-items-center hover:bg-white transition-all transition-colors active:scale-90">+</button>
                                            </div>
                                        </div>

                                        <div className="col-span-8 self-end">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={stock <= 0}
                                                className="w-full inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Ajouter au panier
                                                <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 text-jungle-900 py-16 lg:py-24 border-t border-vanilla-200">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8">
                                <div className="rounded-[2.5rem] bg-white border border-vanilla-200 p-8 lg:p-12">
                                    <div className="flex flex-wrap gap-3 border-b border-vanilla-100 pb-8" role="tablist">
                                        {[
                                            { id: 'desc', label: 'Description' },
                                            { id: 'usage', label: 'Usage & Conseils' },
                                            { id: 'specs', label: 'Spécifications' }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                                                    ? 'bg-jungle-900 text-vanilla-50'
                                                    : 'bg-vanilla-100 text-jungle-700 hover:bg-vanilla-200'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-12">
                                        {activeTab === 'desc' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <div className="space-y-6">
                                                    <h2 className="font-display text-3xl text-jungle-950 italic">{descriptionParagraphs[0] || product.title}</h2>
                                                    <div className="text-lg text-jungle-800/80 leading-relaxed max-w-3xl space-y-5">
                                                        {descriptionParagraphs.slice(1).length > 0 ? descriptionParagraphs.slice(1).map((paragraph, index) => (
                                                            <p key={index}>{paragraph}</p>
                                                        )) : <p>{descriptionParagraphs[0] || product.title}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'usage' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <h2 className="font-display text-3xl text-jungle-950 italic">Sublimez vos créations.</h2>
                                                <p className="mt-4 text-jungle-800/80">Pour extraire toute la quintessence de nos gousses, suivez le guide :</p>
                                                <ul className="mt-8 space-y-6">
                                                    {[
                                                        'Utilisez un couteau bien aiguisé pour fendre la gousse sur toute sa longueur.',
                                                        'Raclez les grains d\'un geste précis, de la base vers la pointe.',
                                                        'Infusez la gousse et les grains dans un liquide froid que vous porterez doucement à ébullition.',
                                                        'Laissez infuser au moins 20 minutes hors du feu, à couvert.'
                                                    ].map((step, i) => (
                                                        <li key={i} className="flex gap-6 items-start">
                                                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-jungle-900 flex items-center justify-center font-bold">{i + 1}</span>
                                                            <p className="text-jungle-800 leading-relaxed font-medium pt-2">{step}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {activeTab === 'specs' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <h2 className="font-display text-3xl text-jungle-950 italic">Informations Techniques</h2>
                                                <div className="mt-10 grid grid-cols-2 gap-px bg-vanilla-200 border border-vanilla-200 rounded-3xl overflow-hidden">
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">Origine</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">Nosy-Be, Madagascar</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">Grade</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">{productGrade}</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">Longueur</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">{productSize}</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">Conditionnement</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900 uppercase">{packagingLabel}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <aside className="lg:col-span-4 space-y-8">
                                <div className="rounded-[2.5rem] bg-white border border-vanilla-200 p-10">
                                    <p className="font-display text-2xl text-jungle-950 italic">Votre confiance.</p>
                                    <div className="mt-8 space-y-10">
                                        <div className="group">
                                            <div className="flex items-center gap-4 text-gold-600 mb-3">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
                                                <p className="font-bold text-sm uppercase tracking-widest">Affinage Naturel</p>
                                            </div>
                                            <p className="text-sm text-jungle-750 leading-relaxed">
                                                Nous ne brûlons aucune étape. L&apos;arôme se développe naturellement au fil des mois dans nos malles de bois.
                                            </p>
                                        </div>
                                        <div className="group">
                                            <div className="flex items-center gap-4 text-gold-600 mb-3">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                                <p className="font-bold text-sm uppercase tracking-widest">Traçabilité Totale</p>
                                            </div>
                                            <p className="text-sm text-jungle-750 leading-relaxed">
                                                Chaque gousse provient directement de nos plantations ou de nos petits producteurs partenaires à Nosy-Be.
                                            </p>
                                        </div>
                                    </div>

                                    <Link href="/contact" className="mt-12 w-full inline-flex items-center justify-center gap-3 rounded-full bg-vanilla-100 text-jungle-900 px-6 py-4 text-sm font-bold uppercase tracking-widest hover:bg-jungle-900 hover:text-vanilla-50 transition-all duration-300">
                                        Poser une question
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    </Link>
                                </div>

                                <div className="p-1 rounded-[2.8rem] bg-gradient-to-br from-gold-500/30 to-vanilla-300">
                                    <div className="rounded-[2.5rem] bg-jungle-900 p-10 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 shine opacity-10"></div>
                                        <p className="relative font-display text-3xl text-gold-500 italic">Offre B2B</p>
                                        <p className="relative mt-4 text-vanilla-100/70 text-sm leading-relaxed">Professionnels, restaurateurs ? Bénéficiez de conditions préférentielles.</p>
                                        <Link href="/b2b" className="relative mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanilla-50 hover:text-gold-500 transition-colors">
                                            Espace Professionnel
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
