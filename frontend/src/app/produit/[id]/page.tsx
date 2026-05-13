'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import type { Product, ProductVariant } from '@/lib/types';
import { productsApi } from '@/lib/api/products';
import { reviewsApi, type ReviewsResponse } from '@/lib/api/reviews';
import { normalizeProductRef } from '@/lib/product-refs';
import { getImageUrl } from '@/lib/utils';
import { trackViewItem } from '@/lib/analytics';
import { useLocale } from '@/lib/locale-context';
import { getLocalizedProduct } from '@/lib/localized-content';
import { withLocale } from '@/lib/i18n';
import { getContactPhoneDisplay, getContactPhoneHref, getWhatsappHref } from '@/lib/site';
import { CATALOG, PEPPER_IMAGE_EN, PEPPER_IMAGE_FR } from '@/lib/products-data';

const CheckIcon = () => (
    <svg className="w-4 h-4 text-gold-500 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function isWildPepperProduct(product: Pick<Product, 'title' | 'slug' | 'sku' | 'id'>) {
    return /poivre|pepper/i.test(`${product.title} ${product.slug} ${product.sku} ${product.id}`);
}

function getDisplayImages(product: Product, locale: 'fr' | 'en') {
    if (!isWildPepperProduct(product)) return product.images;
    return locale === 'en'
        ? [PEPPER_IMAGE_EN, PEPPER_IMAGE_FR]
        : [PEPPER_IMAGE_FR, PEPPER_IMAGE_EN];
}

function withDisplayImages(product: Product, locale: 'fr' | 'en'): Product {
    return {
        ...product,
        images: getDisplayImages(product, locale),
    };
}

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

function getInitialSelectedOptions(product: Product) {
    const firstVariantOptions = product.variants?.[0]?.options as Record<string, string> | undefined;
    if (firstVariantOptions && Object.keys(firstVariantOptions).length > 0) {
        return firstVariantOptions;
    }

    return (product.options || []).reduce<Record<string, string>>((acc, option) => {
        if (option.values.length > 0) acc[option.name] = option.values[0];
        return acc;
    }, {});
}

function resolveSelectedOptions(product: Product, previous: Record<string, string>, optionName: string, value: string) {
    if (!product.variants?.length) {
        return { ...previous, [optionName]: value };
    }

    const attempted = { ...previous, [optionName]: value };
    const exact = findMatchingVariant(product, attempted);
    if (exact) {
        return exact.options as Record<string, string>;
    }

    const partialMatch = product.variants.find((variant) => {
        const variantOptions = (variant.options || {}) as Record<string, string>;
        if (variantOptions[optionName] !== value) return false;

        return Object.entries(previous).every(([key, currentValue]) => {
            if (key === optionName) return true;
            return variantOptions[key] === currentValue;
        });
    });

    if (partialMatch) {
        return partialMatch.options as Record<string, string>;
    }

    const fallback = product.variants.find((variant) => {
        const variantOptions = (variant.options || {}) as Record<string, string>;
        return variantOptions[optionName] === value;
    });

    return (fallback?.options as Record<string, string> | undefined) || attempted;
}

function getOptionValuePrice(product: Product, selectedOptions: Record<string, string>, optionName: string, value: string) {
    if (!product.variants?.length) return null;

    const resolvedOptions = resolveSelectedOptions(product, selectedOptions, optionName, value);
    const variant = findMatchingVariant(product, resolvedOptions);
    return variant?.price ?? null;
}

function extractGrade(product: Product) {
    const fromDetails = product.grade;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(TK\s*\(Noir\)|Gourmet|Noir|Assorti|Poivre Sauvage)/i);
    return match?.[1] || product.collection?.name || product.tags?.[0] || 'Selection';
}

function extractSize(product: Product) {
    const fromDetails = product.size;
    if (typeof fromDetails === 'string' && fromDetails.trim()) return fromDetails;
    const match = product.title.match(/(\d+\s*[–-]\s*\d+\s*cm|\d+\s*cm|Assorti|Volume)/i);
    return match?.[1] || 'Selection';
}

function getUiPackaging(product: Product, currentVariant: ProductVariant | null) {
    const variantOptions = currentVariant?.options as Record<string, string> | undefined;
    if (variantOptions) {
        const firstOption = Object.values(variantOptions)[0];
        if (firstOption) return firstOption;
    }
    const option = product.options?.[0];
    return option?.values?.[0] || 'Vacuum-sealed';
}

function getDescriptionParagraphs(product: Product) {
    return (product.description || '').split(/\n+/).map((text) => text.trim()).filter(Boolean);
}

function getSeoHeading(product: Product, size: string) {
    if (/poivre/i.test(product.title)) {
        return 'Premium wild Madagascar pepper';
    }

    return `Premium Madagascar Bourbon vanilla ${size}`;
}

function getSeoDescription(product: Product, size: string, grade: string, locale: 'fr' | 'en') {
    if (/poivre/i.test(product.title)) {
        return locale === 'en'
            ? 'Hand-harvested wild pepper from Madagascar, with woody and spicy notes, ideal for premium cooking.'
            : 'Poivre sauvage de Madagascar récolté à la main, aux notes boisées et épicées, idéal pour une cuisine premium.';
    }

    return locale === 'en'
        ? `Premium ${grade} vanilla pods selected in Nosy-Be, Madagascar, ${size} format, created for pastry, homemade extract and refined gifting.`
        : `Gousses de vanille premium ${grade}, sélectionnées à Nosy-Be à Madagascar, format ${size}, pour pâtisserie, extrait maison et cadeaux gourmands.`;
}

function getPackHighlights(product: Product) {
    if (!product.variants?.length) return [];

    return product.variants
        .map((variant) => variant.title || Object.values(variant.options || {}).join(' • '))
        .filter(Boolean)
        .slice(0, 3);
}

function getSelectedOfferLabel(product: Product, currentVariant: ProductVariant | null, locale: 'fr' | 'en') {
    if (currentVariant) {
        const optionLabel = Object.values(currentVariant.options || {}).filter(Boolean).join(' · ');
        return currentVariant.title || optionLabel || (locale === 'en' ? 'Selected format' : 'Format sélectionné');
    }

    const optionLabel = product.options?.map((option) => option.values[0]).filter(Boolean).join(' · ');
    return optionLabel || (locale === 'en' ? 'Default product format' : 'Format produit par défaut');
}

function getFallbackProduct(ref: string, locale: 'fr' | 'en'): Product | null {
    const normalizedRef = normalizeProductRef(ref);
    const catalogItem = CATALOG.find((item) => normalizeProductRef(item.id) === normalizedRef || item.id === ref);
    if (!catalogItem) return null;

    const prices = (catalogItem.variants || []).map((variant) => variant.price).filter((price) => price > 0);
    const price = prices.length ? Math.min(...prices) : 0;
    const product: Product = {
        id: normalizedRef,
        title: catalogItem.title,
        description: catalogItem.description || [catalogItem.subtitle, ...catalogItem.bullets].join('\n'),
        sku: normalizedRef.toUpperCase(),
        slug: normalizedRef,
        price,
        stock: 50,
        images: catalogItem.images,
        tags: [catalogItem.grade, catalogItem.size].filter(Boolean),
        published: true,
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
        subtitle: catalogItem.subtitle,
        size: catalogItem.size,
        grade: catalogItem.grade,
        packaging_options: catalogItem.packaging,
        bullets: catalogItem.bullets,
        price_label: catalogItem.price_label,
        options: catalogItem.variants?.length ? [{
            id: `${normalizedRef}-format`,
            productId: normalizedRef,
            name: 'Format',
            values: catalogItem.variants.map((variant) => `${variant.packaging} · ${variant.quantity}`),
            position: 0,
        }] : [],
        variants: (catalogItem.variants || []).map((variant, index) => ({
            id: `${normalizedRef}-variant-${index}`,
            productId: normalizedRef,
            sku: `${normalizedRef}-${index + 1}`,
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

    return withDisplayImages(getLocalizedProduct(product, locale), locale);
}

export default function ProductDetailPage() {
    const { locale } = useLocale();
    const whatsappHref = getWhatsappHref(locale);
    const phoneHref = getContactPhoneHref();
    const phoneDisplay = getContactPhoneDisplay();
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
    const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
    const { addItem, openCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                let response: Product;
                try {
                    response = await productsApi.getProductBySlug(slug);
                } catch (initialError) {
                    const listing = await productsApi.getProducts({ take: 100 });
                    const matched = (listing.data || []).find((candidate) =>
                        candidate.slug === slug ||
                        candidate.id === id ||
                        candidate.sku === id ||
                        candidate.slug === id
                    );

                    if (!matched?.slug) {
                        throw initialError;
                    }

                    response = await productsApi.getProductBySlug(matched.slug);
                }

                const localizedProduct = getLocalizedProduct(response, locale);
                setProduct(withDisplayImages(localizedProduct, locale));
                setSelectedImageIndex(0);
                setSelectedOptions(getInitialSelectedOptions(response));
            } catch (err) {
                console.error('Failed to fetch product:', err);
                const fallback = getFallbackProduct(id, locale);
                if (fallback) {
                    setProduct(fallback);
                    setSelectedImageIndex(0);
                    setSelectedOptions(getInitialSelectedOptions(fallback));
                    setError(null);
                    return;
                }

                setError(err instanceof Error ? err.message : locale === 'en' ? 'Product not found' : 'Produit non trouvé');
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, id, locale]);

    const selectedVariant = useMemo(() => product ? findMatchingVariant(product, selectedOptions) : null, [product, selectedOptions]);

    useEffect(() => {
        if (!product) return;

        const trackingKey = `view_item:${product.id}:${selectedVariant?.id || 'default'}`;
        if (typeof window !== 'undefined') {
            const lastKey = sessionStorage.getItem('last_view_item_key');
            if (lastKey === trackingKey) return;
            sessionStorage.setItem('last_view_item_key', trackingKey);
        }

        trackViewItem(product, selectedVariant || undefined);
    }, [product, selectedVariant]);

    useEffect(() => {
        if (!product?.slug) {
            setReviewsData(null);
            return;
        }

        let cancelled = false;

        const fetchReviews = async () => {
            try {
                const response = await reviewsApi.getProductReviews(product.slug);
                if (!cancelled) {
                    setReviewsData(response);
                }
            } catch (fetchError) {
                console.error('Failed to fetch product reviews:', fetchError);
                if (!cancelled) {
                    setReviewsData(null);
                }
            }
        };

        fetchReviews();

        return () => {
            cancelled = true;
        };
    }, [product?.slug]);

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
                        <h1 className="font-display text-4xl italic">{locale === 'en' ? 'Product not found' : 'Produit non trouvé'}</h1>
                        <p className="mt-3 text-jungle-700/70">{error || (locale === 'en' ? 'This product page is no longer available.' : 'Cette fiche produit n’est plus disponible.')}</p>
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
    const seoHeading = getSeoHeading(product, productSize);
    const seoDescription = getSeoDescription(product, productSize, productGrade, locale);
    const packHighlights = getPackHighlights(product);
    const selectedOfferLabel = getSelectedOfferLabel(product, selectedVariant, locale);
    const isWildPepper = isWildPepperProduct(product);
    const pepperTransportLines = locale === 'en'
        ? ['Price: 10 € incl. VAT / 100 g', '+ shipping costs', '50% of shipping costs offered for launch']
        : ['Prix : 10 € TTC / 100 g', '+ frais de transport', '50 % des frais de livraison offerts pour le lancement'];
    const reviewStats = reviewsData?.stats;
    const topReviews = reviewsData?.reviews?.slice(0, 3) || [];
    const hasReviews = (reviewStats?.totalReviews || 0) > 0;
    const productBullets = (product.bullets && product.bullets.length > 0
        ? product.bullets
        : [
            locale === 'en' ? `${productGrade} carefully selected in Nosy-Be.` : `${productGrade} soigneusement sélectionnée à Nosy-Be.`,
            locale === 'en' ? `${productSize} format for a rich and elegant infusion.` : `${productSize} pour une infusion intense et gourmande.`,
            locale === 'en' ? `${packagingLabel} packaging to preserve aromatic depth.` : `Conditionnement ${packagingLabel.toLowerCase()} pour préserver les arômes.`
        ]).slice(0, 3);

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
                        <nav aria-label={locale === 'en' ? 'Breadcrumb' : "Fil d'ariane"} className="text-sm text-jungle-700/60">
                            <ol className="flex flex-wrap items-center gap-2">
                                <li><Link className="hover:text-gold-600 focus-ring rounded-full px-2 py-1 transition-colors" href={withLocale('/', locale)}>{locale === 'en' ? 'Home' : 'Accueil'}</Link></li>
                                <li className="opacity-40">/</li>
                                <li><Link className="hover:text-gold-600 focus-ring rounded-full px-2 py-1 transition-colors" href={withLocale('/shop', locale)}>{locale === 'en' ? 'Shop' : 'Boutique'}</Link></li>
                                <li className="opacity-40">/</li>
                                <li className="text-jungle-950 font-semibold">{product.title}</li>
                            </ol>
                        </nav>

                        <div className="mt-8 grid lg:grid-cols-12 gap-10 items-start">
                            <div className="lg:col-span-7">
                                <div className="rounded-[2.5rem] border border-vanilla-200 bg-white overflow-hidden">
                                    <div className="relative flex aspect-[16/11] items-center justify-center bg-vanilla-100/30 sm:aspect-[4/3]">
                                        <Image
                                            src={getImageUrl(product.images[selectedImageIndex] || product.images[0])}
                                            alt={locale === 'en' ? `${seoHeading} - image ${selectedImageIndex + 1}` : `${seoHeading} - visuel ${selectedImageIndex + 1}`}
                                            className="absolute inset-0 h-full w-full object-contain p-4 sm:p-0"
                                            fill
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 58vw"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-white/80 border border-vanilla-200 backdrop-blur text-jungle-800">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                                                {productGrade}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900">
                                                {locale === 'en' ? 'Premium' : 'Premium'}
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
                                                    <Image
                                                        src={getImageUrl(img)}
                                                        alt={locale === 'en' ? `${seoHeading} - detail ${i + 1}` : `${seoHeading} - détail ${i + 1}`}
                                                        className="h-full w-full object-cover"
                                                        fill
                                                        sizes="(max-width: 1024px) 25vw, 12vw"
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

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-xs font-semibold text-jungle-900">
                                            <svg className="w-3.5 h-3.5 text-gold-600" viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                            {hasReviews
                                                ? `${reviewStats?.averageRating.toFixed(1)}/5 • ${reviewStats?.totalReviews} ${locale === 'en' ? 'reviews' : 'avis'}`
                                                : (locale === 'en' ? 'A premium selection loved by chefs and pastry lovers' : 'Sélection premium appréciée en cuisine et pâtisserie')}
                                        </div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-vanilla-200 bg-vanilla-50 px-4 py-2 text-xs font-semibold text-jungle-800">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500"></span>
                                            {locale === 'en' ? 'Shipping across France, Europe and the USA' : 'Expédition France, Europe et USA'}
                                        </div>
                                    </div>

                                    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">{locale === 'en' ? 'Selected vanilla from Nosy-Be' : 'Vanille sélectionnée à Nosy-Be'}</p>
                                    <h1 className="mt-3 font-display text-4xl leading-[1.06] text-jungle-950 italic">{seoHeading}</h1>
                                    <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-jungle-500">{product.title}</p>
                                    <p className="mt-3 text-lg text-jungle-700/70 leading-relaxed font-medium">{seoDescription}</p>

                                    <div className="mt-8 flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">{locale === 'en' ? 'Selected offer' : 'Prix de la sélection'}</p>
                                            <div className="flex items-end gap-3 mt-1">
                                                <p className="text-4xl font-semibold text-jungle-950">
                                                    {isOnRequest ? (locale === 'en' ? 'On request' : 'Sur demande') : `${(currentPrice / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}`}
                                                </p>
                                            </div>
                                            <p className="mt-2 text-sm font-semibold text-jungle-700">{selectedOfferLabel}</p>
                                            {isWildPepper ? (
                                                <div className="mt-4 space-y-1 rounded-2xl border border-gold-200 bg-gold-50 px-4 py-3 text-sm font-bold text-jungle-900">
                                                    {pepperTransportLines.map((line) => (
                                                        <p key={line}>{line}</p>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="rounded-2xl bg-vanilla-50 border border-vanilla-200 p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 text-center">{locale === 'en' ? 'Availability' : 'Disponibilité'}</p>
                                            <p className="text-sm font-semibold text-gold-600 mt-1">{stock > 0 ? (locale === 'en' ? 'In stock' : 'En stock') : (locale === 'en' ? 'Sold out' : 'Épuisé')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-6">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-500">{locale === 'en' ? 'Why this selection stands out' : 'Pourquoi cette sélection plaît autant'}</p>
                                        <ul className="mt-4 space-y-3">
                                            {productBullets.map((bullet) => (
                                                <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-jungle-800">
                                                    <CheckIcon />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {packHighlights.length > 0 ? (
                                        <div className="mt-6 rounded-[2rem] border border-gold-200 bg-gold-50 p-6">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-700">{locale === 'en' ? 'Available packs and formats' : 'Packs et formats disponibles'}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {packHighlights.map((pack) => (
                                                    <span key={pack} className="rounded-full border border-gold-200 bg-white px-4 py-2 text-xs font-semibold text-jungle-800">
                                                        {pack}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    {getVariantOptions(product).length > 0 && (
                                        <div className="mt-8">
                                            <p className="text-sm font-bold uppercase tracking-widest text-jungle-400 ml-1">{locale === 'en' ? 'Select your format' : 'Options de sélection'}</p>
                                            <div className="mt-3 space-y-4">
                                                {getVariantOptions(product).map((option) => (
                                                    <div key={option.id}>
                                                        <p className="text-xs font-semibold uppercase tracking-widest text-jungle-500 mb-2">{option.name}</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {option.values.map((value) => {
                                                                const selected = selectedOptions[option.name] === value;
                                                                const optionPrice = getOptionValuePrice(product, selectedOptions, option.name, value);
                                                                return (
                                                                    <button
                                                                        key={value}
                                                                        onClick={() => setSelectedOptions((prev) => resolveSelectedOptions(product, prev, option.name, value))}
                                                                        className={`inline-flex flex-col items-start justify-center gap-1 rounded-2xl px-5 py-4 text-sm font-bold border transition-all ${selected
                                                                            ? 'bg-jungle-900 text-vanilla-50 border-jungle-900'
                                                                            : 'bg-vanilla-50 border-vanilla-200 text-jungle-700 hover:bg-white hover:border-gold-500/30'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span className="truncate">{value}</span>
                                                                            {selected && <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                                                                        </div>
                                                                        {optionPrice !== null && (
                                                                            <div className={`text-[11px] font-medium ${selected ? 'text-vanilla-100/60' : 'text-jungle-700/50'}`}>
                                                                                {(optionPrice / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
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
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-jungle-400 ml-1">{locale === 'en' ? 'Quantity' : 'Quantité'}</label>
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
                                                {locale === 'en' ? 'Add to cart' : 'Ajouter au panier'}
                                                <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-[2rem] border border-gold-200 bg-gold-50 p-5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-700">
                                            {locale === 'en' ? 'Before you order' : 'Avant votre achat'}
                                        </p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                            {[
                                                locale === 'en' ? 'Prepared within 24-48h' : 'Préparation sous 24–48h',
                                                locale === 'en' ? 'France & international delivery' : 'Livraison France & international',
                                                locale === 'en' ? 'Tracked order' : 'Suivi de commande'
                                            ].map((item) => (
                                                <div key={item} className="flex items-start gap-2 text-sm font-semibold text-jungle-900">
                                                    <CheckIcon />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                        {[
                                            locale === 'en' ? 'Secure Stripe / PayPal payment' : 'Paiement sécurisé Stripe / PayPal',
                                            locale === 'en' ? 'Quality guarantee' : 'Garantie qualité',
                                            locale === 'en' ? 'Verified Nosy-Be origin' : 'Origine contrôlée Nosy-Be'
                                        ].map((item) => (
                                            <div key={item} className="rounded-2xl border border-vanilla-200 bg-white px-4 py-4 text-center text-xs font-semibold text-jungle-800">
                                                {item}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-[2rem] border border-[#25D366]/25 bg-[#25D366]/10 p-6">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#128C7E]">
                                            {locale === 'en' ? 'Need a quick answer before ordering?' : 'Besoin d’une réponse rapide avant commande ?'}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed text-jungle-800">
                                            {locale === 'en'
                                                ? 'Use WhatsApp for advice on grade, quantity, delivery timing or the best format for pastry, gifting or homemade extract.'
                                                : 'Utilisez WhatsApp pour demander conseil sur le grade, la quantité, le délai de livraison ou le bon format pour la pâtisserie, le cadeau ou l’extrait maison.'}
                                        </p>
                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                            {whatsappHref ? (
                                                <a
                                                    href={whatsappHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                                >
                                                    {locale === 'en' ? 'Ask on WhatsApp' : 'Poser ma question sur WhatsApp'}
                                                </a>
                                            ) : null}
                                            <a
                                                href={phoneHref}
                                                className="inline-flex items-center justify-center rounded-full border border-vanilla-200 bg-white px-5 py-3 text-sm font-semibold text-jungle-900 transition hover:border-gold-500/40"
                                            >
                                                {locale === 'en' ? `Call ${phoneDisplay}` : `Appeler ${phoneDisplay}`}
                                            </a>
                                        </div>
                                    </div>

                                    {stock > 0 && stock <= 10 ? (
                                        <div className="mt-6 rounded-[2rem] border border-cacao-900/10 bg-jungle-950 px-5 py-4 text-sm font-semibold text-vanilla-50">
                                            {locale === 'en' ? 'Limited stock on this format: secure your selection before it sells out.' : 'Stock limité sur ce format : sécurisez votre sélection avant rupture.'}
                                        </div>
                                    ) : null}
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
                                            { id: 'desc', label: locale === 'en' ? 'Description' : 'Description' },
                                            { id: 'usage', label: locale === 'en' ? 'Use & advice' : 'Usage & Conseils' },
                                            { id: 'specs', label: locale === 'en' ? 'Specifications' : 'Spécifications' }
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
                                                    <h2 className="font-display text-3xl text-jungle-950 italic">{seoHeading}</h2>
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
                                                <h2 className="font-display text-3xl text-jungle-950 italic">{locale === 'en' ? 'Elevate your creations.' : 'Sublimez vos créations.'}</h2>
                                                <p className="mt-4 text-jungle-800/80">{locale === 'en' ? 'To reveal the full depth of our pods, follow these steps:' : 'Pour extraire toute la quintessence de nos gousses, suivez le guide :'}</p>
                                                <ul className="mt-8 space-y-6">
                                                    {[
                                                        locale === 'en' ? 'Use a sharp knife to split the pod open lengthwise.' : 'Utilisez un couteau bien aiguisé pour fendre la gousse sur toute sa longueur.',
                                                        locale === 'en' ? 'Scrape the seeds from base to tip with a precise motion.' : 'Raclez les grains d\'un geste précis, de la base vers la pointe.',
                                                        locale === 'en' ? 'Infuse both pod and seeds in a cold liquid, then bring it gently to a simmer.' : 'Infusez la gousse et les grains dans un liquide froid que vous porterez doucement à ébullition.',
                                                        locale === 'en' ? 'Let it steep for at least 20 minutes off the heat, covered.' : 'Laissez infuser au moins 20 minutes hors du feu, à couvert.'
                                                    ].map((step, i) => (
                                                        <li key={i} className="flex gap-6 items-start">
                                                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-500 text-jungle-900 flex items-center justify-center font-bold">{i + 1}</span>
                                                            <p className="text-jungle-800 leading-relaxed font-medium pt-2">{step}</p>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-10 grid gap-4 lg:grid-cols-2">
                                                    <div className="rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-jungle-500">
                                                            {locale === 'en' ? 'Storage advice' : 'Conseils de conservation'}
                                                        </p>
                                                        <p className="mt-3 text-sm leading-relaxed text-jungle-800">
                                                            {locale === 'en'
                                                                ? 'Keep pods in their tube or airtight packaging, away from heat, light and humidity. They stay supple longer at room temperature than in the fridge.'
                                                                : 'Conservez les gousses dans leur tube ou emballage hermétique, à l’abri de la chaleur, de la lumière et de l’humidité. Elles restent plus souples à température ambiante qu’au réfrigérateur.'}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-[2rem] border border-gold-200 bg-gold-50 p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                                            {locale === 'en' ? 'Delivery guidance' : 'Repères livraison'}
                                                        </p>
                                                        <p className="mt-3 text-sm leading-relaxed text-jungle-800">
                                                            {locale === 'en'
                                                                ? 'Orders are prepared with care and shipped with tracking. Use WhatsApp if you need a delivery estimate before confirming your order.'
                                                                : 'Les commandes sont préparées avec soin et expédiées avec suivi. Utilisez WhatsApp si vous avez besoin d’un délai estimé avant de confirmer votre panier.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'specs' && (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <h2 className="font-display text-3xl text-jungle-950 italic">{locale === 'en' ? 'Technical details' : 'Informations Techniques'}</h2>
                                                <div className="mt-10 grid grid-cols-2 gap-px bg-vanilla-200 border border-vanilla-200 rounded-3xl overflow-hidden">
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">{locale === 'en' ? 'Origin' : 'Origine'}</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">Nosy-Be, Madagascar</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">{locale === 'en' ? 'Grade' : 'Grade'}</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">{productGrade}</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">{locale === 'en' ? 'Length' : 'Longueur'}</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900">{productSize}</p>
                                                    </div>
                                                    <div className="bg-white p-6">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-400">{locale === 'en' ? 'Packaging' : 'Conditionnement'}</p>
                                                        <p className="mt-2 text-lg font-semibold text-jungle-900 uppercase">{packagingLabel}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 rounded-[2.5rem] bg-white border border-vanilla-200 p-8 lg:p-12">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-jungle-500">{locale === 'en' ? 'Client reviews' : 'Avis clients'}</p>
                                            <h2 className="mt-3 font-display text-3xl text-jungle-950 italic">{locale === 'en' ? 'What clients say' : 'Ce que disent les clients'}</h2>
                                        </div>
                                        <div className="rounded-2xl border border-gold-200 bg-gold-50 px-5 py-4 text-sm font-semibold text-jungle-900">
                                            {hasReviews
                                                ? `${reviewStats?.averageRating.toFixed(1)}/5 ${locale === 'en' ? `average across ${reviewStats?.totalReviews} reviews` : `de moyenne sur ${reviewStats?.totalReviews} avis`}`
                                                : (locale === 'en' ? 'Client reviews will appear here shortly' : 'Les premiers retours clients apparaîtront ici')}
                                        </div>
                                    </div>

                                    {hasReviews ? (
                                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                                            {topReviews.map((review) => (
                                                <article key={review.id} className="rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-6">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm font-bold text-jungle-900">
                                                        {review.customer?.firstName || (locale === 'en' ? 'Client' : 'Client')} {review.customer?.lastName?.slice(0, 1) ? `${review.customer.lastName.slice(0, 1)}.` : ''}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-gold-600">
                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                <svg key={index} className={`h-4 w-4 ${index < review.rating ? 'opacity-100' : 'opacity-20'}`} viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.title ? (
                                                        <p className="mt-4 text-base font-semibold text-jungle-950">{review.title}</p>
                                                    ) : null}
                                                    <p className="mt-3 text-sm leading-relaxed text-jungle-800/80">{review.comment}</p>
                                                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-jungle-500">
                                                        {review.verifiedPurchase ? (locale === 'en' ? 'Verified purchase' : 'Achat vérifié') : (locale === 'en' ? 'Client review' : 'Avis client')}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                                            {[
                                                {
                                                    title: locale === 'en' ? 'Controlled quality' : 'Qualité contrôlée',
                                                    text: locale === 'en' ? 'Pods are selected for suppleness, aroma and clean presentation before shipping.' : 'Les gousses sont sélectionnées pour leur souplesse, leur parfum et leur présentation avant expédition.'
                                                },
                                                {
                                                    title: locale === 'en' ? 'Tracked orders' : 'Commandes suivies',
                                                    text: locale === 'en' ? 'Every order is prepared carefully and shipped with tracking information.' : 'Chaque commande est préparée avec soin et expédiée avec les informations de suivi.'
                                                },
                                                {
                                                    title: locale === 'en' ? 'Direct contact' : 'Contact direct',
                                                    text: locale === 'en' ? 'WhatsApp and email are available for format, grade or delivery questions.' : 'WhatsApp et email restent disponibles pour les questions de format, grade ou livraison.'
                                                }
                                            ].map((item) => (
                                                <article key={item.title} className="rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-6">
                                                    <p className="text-sm font-bold text-jungle-950">{item.title}</p>
                                                    <p className="mt-3 text-sm leading-relaxed text-jungle-800/75">{item.text}</p>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <aside className="lg:col-span-4 space-y-8">
                                <div className="rounded-[2.5rem] bg-white border border-vanilla-200 p-10">
                                    <p className="font-display text-2xl text-jungle-950 italic">{locale === 'en' ? 'Why clients trust us' : 'Pourquoi nous faire confiance'}</p>
                                    <div className="mt-8 space-y-10">
                                        <div className="group">
                                            <div className="flex items-center gap-4 text-gold-600 mb-3">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
                                                <p className="font-bold text-sm uppercase tracking-widest">{locale === 'en' ? 'Natural curing' : 'Affinage naturel'}</p>
                                            </div>
                                            <p className="text-sm text-jungle-750 leading-relaxed">
                                                {locale === 'en' ? 'We do not rush the process. Aroma develops naturally over several months in our wooden curing chests.' : 'Nous ne brûlons aucune étape. L&apos;arôme se développe naturellement au fil des mois dans nos malles de bois.'}
                                            </p>
                                        </div>
                                        <div className="group">
                                            <div className="flex items-center gap-4 text-gold-600 mb-3">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
                                                <p className="font-bold text-sm uppercase tracking-widest">{locale === 'en' ? 'Full traceability' : 'Traçabilité totale'}</p>
                                            </div>
                                            <p className="text-sm text-jungle-750 leading-relaxed">
                                                {locale === 'en' ? 'Each pod comes directly from our plantations or from our trusted partner growers in Nosy-Be.' : 'Chaque gousse provient directement de nos plantations ou de nos petits producteurs partenaires à Nosy-Be.'}
                                            </p>
                                        </div>
                                    </div>

                                    <Link href={withLocale('/contact', locale)} className="mt-12 w-full inline-flex items-center justify-center gap-3 rounded-full bg-vanilla-100 text-jungle-900 px-6 py-4 text-sm font-bold uppercase tracking-widest hover:bg-jungle-900 hover:text-vanilla-50 transition-all duration-300">
                                        {locale === 'en' ? 'Ask a question' : 'Poser une question'}
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    </Link>
                                </div>

                                <div className="p-1 rounded-[2.8rem] bg-gradient-to-br from-gold-500/30 to-vanilla-300">
                                    <div className="rounded-[2.5rem] bg-jungle-900 p-10 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 shine opacity-10"></div>
                                        <p className="relative font-display text-3xl text-gold-500 italic">{locale === 'en' ? 'B2B offer' : 'Offre B2B'}</p>
                                        <p className="relative mt-4 text-vanilla-100/70 text-sm leading-relaxed">{locale === 'en' ? 'For chefs, retailers and hospitality buyers looking for preferred trade terms.' : 'Professionnels, restaurateurs ? Bénéficiez de conditions préférentielles.'}</p>
                                        <Link href={withLocale('/b2b', locale)} className="relative mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-vanilla-50 hover:text-gold-500 transition-colors">
                                            {locale === 'en' ? 'Wholesale access' : 'Espace professionnel'}
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
