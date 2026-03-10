'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import RelatedProducts from '@/components/related-products';
import { useCart } from '@/lib/cart-context';
import { productsApi } from '@/lib/api/products';
import { getImageUrl } from '@/lib/utils';
import { normalizeProductRef } from '@/lib/product-refs';
import type { Product, ProductVariant } from '@/lib/types';

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-gold-500 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function getVariantOptions(product: Product) {
    return product.options || [];
}

function findMatchingVariant(product: Product, selectedOptions: Record<string, string>) {
    if (!product.variants?.length) return null;

    return (
        product.variants.find((variant) => {
            const variantOptions = (variant.options || {}) as Record<string, string>;
            return Object.entries(selectedOptions).every(([optionName, value]) => variantOptions[optionName] === value);
        }) || null
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const routeRef = params.id as string;
    const slug = normalizeProductRef(routeRef);
    const { addItem, openCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productsApi.getProductBySlug(slug);
                setProduct(response);
                setSelectedImage(0);

                const initialOptions = (response.options || []).reduce<Record<string, string>>((acc, option) => {
                    if (option.values.length > 0) {
                        acc[option.name] = option.values[0];
                    }
                    return acc;
                }, {});
                setSelectedOptions(initialOptions);
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(err instanceof Error ? err.message : 'Produit introuvable');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const currentVariant = useMemo(() => {
        if (!product) return null;
        return findMatchingVariant(product, selectedOptions);
    }, [product, selectedOptions]);

    const price = currentVariant?.price ?? product?.price ?? 0;
    const compareAtPrice = currentVariant?.compareAtPrice ?? product?.compareAtPrice;
    const stock = currentVariant?.stock ?? product?.stock ?? 0;
    const isOutOfStock = stock <= 0;
    const descriptionParagraphs = useMemo(
        () => (product?.description || '').split(/\n+/).map((text) => text.trim()).filter(Boolean),
        [product?.description],
    );

    const handleAddToCart = () => {
        if (!product || isOutOfStock) return;
        addItem(product, quantity, currentVariant || undefined);
        openCart();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-vanilla-50 text-jungle-900">
                <div className="bg-jungle-900 border-b border-vanilla-100/10"><Header /></div>
                <div className="flex justify-center py-24">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (!product || error) {
        return (
            <div className="min-h-screen bg-vanilla-50 text-jungle-900">
                <div className="bg-jungle-900 border-b border-vanilla-100/10"><Header /></div>
                <main className="mx-auto max-w-4xl px-4 py-20 text-center">
                    <h1 className="font-display text-4xl italic">Produit introuvable</h1>
                    <p className="mt-4 text-cacao-600">{error || 'Cette fiche produit n’est plus disponible.'}</p>
                    <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-6 py-3 text-sm font-bold text-vanilla-50">
                        Retour à la boutique
                        <ArrowRightIcon />
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 font-sans antialiased text-jungle-900">
            <div className="bg-jungle-900 border-b border-vanilla-100/10">
                <Header />
            </div>

            <main id="content" className="flex-grow">
                <section className="relative overflow-hidden bg-vanilla-50 pb-16">
                    <div className="absolute inset-0 grain opacity-20 pointer-events-none" aria-hidden="true"></div>
                    <div className="relative mx-auto max-w-7xl px-4 pt-10">
                        <nav aria-label="Fil d'ariane" className="text-sm text-jungle-700/60">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link className="hover:text-gold-600 rounded-full px-2 py-1 transition-colors" href="/">Accueil</Link></li>
                                <li className="opacity-40">/</li>
                                <li><Link className="hover:text-gold-600 rounded-full px-2 py-1 transition-colors" href="/shop">Boutique</Link></li>
                                <li className="opacity-40">/</li>
                                <li className="text-jungle-950 font-semibold">{product.title}</li>
                            </ol>
                        </nav>

                        <div className="mt-8 grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-7">
                                <div className="rounded-[2.5rem] border border-vanilla-200 bg-white overflow-hidden">
                                    <div className="aspect-[4/3] relative bg-vanilla-100/30">
                                        <img
                                            src={getImageUrl(product.images[selectedImage] || product.images[0])}
                                            alt={product.title}
                                            className="absolute inset-0 w-full h-full object-contain"
                                        />
                                    </div>

                                    {product.images.length > 1 && (
                                        <div className="p-4 border-t border-vanilla-100">
                                            <div className="grid grid-cols-4 gap-4">
                                                {product.images.map((img, index) => (
                                                    <button
                                                        key={`${img}-${index}`}
                                                        onClick={() => setSelectedImage(index)}
                                                        className={`rounded-2xl bg-vanilla-50 border overflow-hidden aspect-square ${selectedImage === index ? 'border-gold-500' : 'border-vanilla-200'}`}
                                                    >
                                                        <img src={getImageUrl(img)} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="rounded-[2.5rem] bg-white border border-vanilla-200 p-8">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-vanilla-100 px-4 py-2 text-xs font-semibold text-jungle-800 border border-vanilla-200">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                                        {product.collection?.name || 'M.S.V-NOSY BE'}
                                    </div>

                                    <h1 className="mt-6 font-display text-4xl leading-[1.06] text-jungle-950 italic">{product.title}</h1>

                                    <div className="mt-8 flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">Prix</p>
                                            <div className="flex items-end gap-3 mt-1">
                                                <p className="text-4xl font-semibold text-jungle-950">
                                                    {(price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                </p>
                                                {compareAtPrice && compareAtPrice > price && (
                                                    <p className="text-lg text-cacao-400 line-through">
                                                        {(compareAtPrice / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl bg-vanilla-50 border border-vanilla-200 p-4 text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">Stock</p>
                                            <p className={`text-sm font-semibold mt-1 ${isOutOfStock ? 'text-red-600' : 'text-gold-600'}`}>
                                                {isOutOfStock ? 'Épuisé' : `${stock} disponible${stock > 1 ? 's' : ''}`}
                                            </p>
                                        </div>
                                    </div>

                                    {getVariantOptions(product).length > 0 && (
                                        <div className="mt-8 space-y-6">
                                            {getVariantOptions(product).map((option) => (
                                                <div key={option.id}>
                                                    <p className="text-sm font-bold uppercase tracking-widest text-jungle-400 ml-1">{option.name}</p>
                                                    <div className="mt-3 flex flex-wrap gap-3">
                                                        {option.values.map((value) => {
                                                            const selected = selectedOptions[option.name] === value;
                                                            return (
                                                                <button
                                                                    key={value}
                                                                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                                                                    className={`rounded-2xl px-5 py-3 text-sm font-bold border transition-all ${selected ? 'bg-jungle-900 text-vanilla-50 border-jungle-900' : 'bg-vanilla-50 border-vanilla-200 text-jungle-700 hover:bg-white hover:border-gold-500/30'}`}
                                                                >
                                                                    {value}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-4">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">Quantité</label>
                                            <div className="mt-2 inline-flex w-full items-center justify-between rounded-full bg-vanilla-100 border border-vanilla-200 p-1">
                                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full grid place-items-center hover:bg-white transition-all">−</button>
                                                <span className="text-sm font-bold text-jungle-900">{quantity}</span>
                                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full grid place-items-center hover:bg-white transition-all">+</button>
                                            </div>
                                        </div>
                                        <div className="col-span-8">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={isOutOfStock}
                                                className={`w-full inline-flex items-center justify-center gap-3 rounded-full px-8 py-5 text-base font-bold transition-all ${isOutOfStock ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' : 'text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:shadow-xl hover:scale-[1.02]'}`}
                                            >
                                                {isOutOfStock ? 'Produit indisponible' : 'Ajouter au panier'}
                                                <ArrowRightIcon />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 rounded-[24px] bg-vanilla-50 border border-vanilla-200 p-6">
                                        <p className="text-xs font-bold uppercase tracking-widest text-cacao-500">Description</p>
                                        <div className="mt-4 space-y-4 text-cacao-700 leading-relaxed">
                                            {descriptionParagraphs.length > 0 ? descriptionParagraphs.map((paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            )) : <p>{product.title}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-3 text-sm text-cacao-700">
                                        <div className="flex gap-2"><CheckIcon /><span>Paiement sécurisé Stripe / PayPal</span></div>
                                        <div className="flex gap-2"><CheckIcon /><span>Stock et prix synchronisés avec l'administration</span></div>
                                        <div className="flex gap-2"><CheckIcon /><span>SKU: {currentVariant?.sku || product.sku}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <RelatedProducts currentProductId={product.id} collectionId={product.collection?.slug} />
            </main>

            <Footer />
        </div>
    );
}
