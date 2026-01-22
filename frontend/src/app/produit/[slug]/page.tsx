import { productsApi } from '@/lib/api/products';
import { reviewsApi } from '@/lib/api/reviews'; // [NEW]
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductGallery from '@/components/product-gallery';
import ProductActions from '@/components/product-actions';
import ProductAccordions from '@/components/product-accordions';
import ProductCarousel from '@/components/product-carousel';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import RelatedProducts from '@/components/related-products';
import type { Product } from '@/lib/types';
import type { Review, ReviewsResponse } from '@/lib/api/reviews'; // [NEW]

import type { Metadata, ResolvingMetadata } from 'next';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(
    { params }: ProductPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    let product;

    try {
        product = await productsApi.getProductBySlug(slug);
    } catch (e) {
        return {
            title: 'Produit non trouvé | Tsniout Shop',
            description: 'Produit introuvable.'
        };
    }

    if (!product) {
        return {
            title: 'Produit non trouvé | Tsniout Shop',
            description: 'Produit introuvable.'
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const productName = product.title || 'Produit Tsniout';
    const productDesc = product.description || 'Découvrez notre collection de mode tsniout.';
    const productImage = product.images?.[0] || '';

    return {
        title: `${productName} | Tsniout Shop`,
        description: productDesc.substring(0, 160),
        openGraph: {
            title: productName,
            description: productDesc.substring(0, 160),
            images: productImage ? [productImage, ...previousImages] : previousImages,
            url: `https://tsniout-shop.fr/produit/${slug}`,
        },
        alternates: {
            canonical: `https://tsniout-shop.fr/produit/${slug}`,
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    let product;
    const { slug } = await params;

    try {
        product = await productsApi.getProductBySlug(slug);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        notFound();
    }

    if (!product) {
        notFound();
    }


    // Fetch reviews
    let reviewsData: ReviewsResponse | null = null;

    try {
        // Fetch reviews
        reviewsData = await reviewsApi.getProductReviews(slug);
    } catch (err) {
        console.error('Failed to fetch reviews', err);
    }

    // Dynamic delivery estimate (4-5 business days)
    const today = new Date();
    const getDeliveryDate = (daysToAdd: number) => {
        let date = new Date(today);
        let added = 0;
        while (added < daysToAdd) {
            date.setDate(date.getDate() + 1);
            if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
                added++;
            }
        }
        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    const HEBREW_NAMES = [
        "Hanna C.", "Lea V.", "Rachel M.", "Sarah B.", "Rivka L.",
        "Chana B.", "Esther M.", "Ruth A.", "Miriam S.", "Devorah K.",
        "Shira P.", "Aviva G.", "Noa K.", "Maya L.", "Talia R.",
        "Adina S.", "Batsheva D.", "Elisheva F.", "Hadassah T.", "Na'ama J."
    ];

    const getPersistentName = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % HEBREW_NAMES.length;
        return HEBREW_NAMES[index];
    };

    const deliveryStart = getDeliveryDate(4);
    const deliveryEnd = getDeliveryDate(5);

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Header />

            <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
                {/* Breadcrumbs */}
                <Link
                    href="/produit"
                    className="mb-8 flex items-center gap-2 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors group"
                >
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Retour à la boutique</span>
                </Link>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-20">
                    {/* Left: Sticky Gallery (6/12) */}
                    <div className="lg:col-span-6 relative">
                        <div className="sticky top-24">
                            <ProductGallery images={product.images || []} title={product.title} />
                        </div>
                    </div>

                    {/* Right: Info (6/12) */}
                    <div className="lg:col-span-6 flex flex-col">
                        <header className="mb-6">
                            <h1 className="text-[32px] font-semibold text-zinc-900 mb-2">
                                {product.title}
                            </h1>

                            {/* A. Titre + sous-titre bénéfice */}
                            <p className="text-sm italic text-zinc-500 mb-6">
                                Fluide, élégante, couvre bien sans alourdir
                            </p>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(reviewsData?.stats?.averageRating || product.averageRating || 0) ? 'text-amber-500' : 'text-zinc-200'} fill-current`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <a
                                    href="#reviews"
                                    className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest cursor-pointer hover:text-zinc-900 transition-colors flex items-center gap-1.5"
                                >
                                    {reviewsData?.stats?.totalReviews || product.reviewsCount || 0} avis clients <span className="text-zinc-300">|</span> ➡️ Voir les avis
                                </a>
                            </div>

                            {/* B. Prix + promo + urgence */}
                            <div className="flex items-center gap-4 mb-1">
                                <span className="text-2xl font-bold text-zinc-900">
                                    {(product.price / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', '.')} €
                                </span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <>
                                        <span className="text-lg text-zinc-300 line-through">
                                            {(product.compareAtPrice / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }).replace(',', '.')} €
                                        </span>
                                        <span className="bg-[#fff1f2] text-[#e11d48] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>

                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        '@context': 'https://schema.org',
                                        '@type': 'Product',
                                        name: product.title,
                                        description: product.description,
                                        image: product.images,
                                        sku: product.sku,
                                        brand: {
                                            '@type': 'Brand',
                                            name: 'Tsniout Shop'
                                        },
                                        offers: {
                                            '@type': 'Offer',
                                            priceCurrency: 'EUR',
                                            price: (product.price / 100).toFixed(2),
                                            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                                            url: `https://tsniout-shop.fr/produit/${slug}`
                                        },
                                        aggregateRating: reviewsData?.stats?.totalReviews && reviewsData.stats.totalReviews > 0 ? {
                                            '@type': 'AggregateRating',
                                            ratingValue: reviewsData.stats.averageRating,
                                            reviewCount: reviewsData.stats.totalReviews
                                        } : undefined
                                    })
                                }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        '@context': 'https://schema.org',
                                        '@type': 'BreadcrumbList',
                                        itemListElement: [
                                            {
                                                '@type': 'ListItem',
                                                position: 1,
                                                name: 'Accueil',
                                                item: 'https://tsniout-shop.fr'
                                            },
                                            {
                                                '@type': 'ListItem',
                                                position: 2,
                                                name: 'Boutique',
                                                item: 'https://tsniout-shop.fr/'
                                            },
                                            {
                                                '@type': 'ListItem',
                                                position: 3,
                                                name: product.title,
                                                item: `https://tsniout-shop.fr/produit/${slug}`
                                            }
                                        ]
                                    })
                                }}
                            />
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify({
                                        '@context': 'https://schema.org',
                                        '@type': 'FAQPage',
                                        mainEntity: [
                                            {
                                                '@type': 'Question',
                                                name: 'Est-ce que ça taille petit ?',
                                                acceptedAnswer: {
                                                    '@type': 'Answer',
                                                    text: 'Non, ce modèle taille normalement. Prenez votre taille habituelle. Si vous êtes entre deux tailles, privilégiez celle du dessus pour plus de confort.'
                                                }
                                            },
                                            {
                                                '@type': 'Question',
                                                name: 'Est-ce que c’est transparent ?',
                                                acceptedAnswer: {
                                                    '@type': 'Answer',
                                                    text: 'Absolument pas ! Le tissu a été sélectionné pour son opacité totale, même en plein soleil. Vous pouvez la porter en toute confiance.'
                                                }
                                            },
                                            {
                                                '@type': 'Question',
                                                name: 'Ça gratte ?',
                                                acceptedAnswer: {
                                                    '@type': 'Answer',
                                                    text: 'Au contraire, la viscose est une matière naturelle ultra-douce. C\'est comme une seconde peau, idéal pour les peaux sensibles.'
                                                }
                                            },
                                            {
                                                '@type': 'Question',
                                                name: 'Peut se porter en hiver ?',
                                                acceptedAnswer: {
                                                    '@type': 'Answer',
                                                    text: 'Oui, avec des collants et un gros pull maille ou un cardigan, elle est parfaite pour l\'hiver grâce à son étoffe de qualité.'
                                                }
                                            }
                                        ]
                                    })
                                }}
                            />

                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <div className="flex items-center gap-1.5 mb-6">
                                    <span className="text-[11px] text-amber-700 font-medium tracking-tight flex items-center gap-1">
                                        ⏳ Offre limitée
                                    </span>
                                </div>
                            )}
                        </header>

                        {/* Rational Box (Moved Here) */}
                        <div className="mb-8 bg-zinc-50/70 p-5 rounded-lg border border-zinc-100/50">
                            <div className="space-y-2">
                                <p className="text-sm text-zinc-600">
                                    <span className="font-semibold text-zinc-900">Coupe :</span> normale
                                </p>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    <span className="font-semibold text-zinc-900">Matière :</span> tissu fluide et agréable à porter ✨
                                </p>
                                <p className="text-sm text-zinc-600">
                                    Le modèle mesure 1m72 et porte du S
                                </p>
                                <p className="text-xs text-amber-700 italic flex items-center gap-1.5 pt-1">
                                    💡 Si tu hésites entre deux tailles : prends la plus grande
                                </p>
                            </div>
                        </div>

                        {/* Interactive Actions area (Size selection, CTA, Payment, Sticky) */}
                        <ProductActions
                            product={product}
                            deliveryEstimate={`entre ${deliveryStart} et ${deliveryEnd}`}
                        />

                        {/* F. Bloc "Pourquoi vous allez l'adorer" */}
                        <div className="mb-2 mt-10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4 border-l-2 border-zinc-900 pl-3">
                                Pourquoi vous allez l'adorer
                            </h3>
                            <ul className="space-y-2 mb-4">
                                {[
                                    'Ne colle pas / ne gratte pas',
                                    'Coupe flatteuse (taille haute / longueur)',
                                    'Style polyvalent : se porte avec chemise ou pull',
                                    'Tombe parfaitement même en mouvement',
                                    'Facile d\'entretien (lavage machine délicat)'
                                ].map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 font-medium">
                                        <svg className="w-4 h-4 text-zinc-900 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Accordéons (Interactive Client Component) */}
                        <ProductAccordions />

                        {/* 9. SEO Text Block (Indexable) */}
                        <div className="mt-8 text-sm text-zinc-600 leading-relaxed bg-zinc-50/50 p-6 rounded-lg border border-zinc-100">
                            <h2 className="font-serif text-lg text-zinc-900 mb-2">Comment porter la {product.title} ?</h2>
                            <p>
                                Cette pièce intemporelle se marie parfaitement avec une chemise en lin pour un look décontracté chic, ou un haut structuré pour une allure plus formelle.
                                Idéale pour la mi-saison, elle s'adapte à toutes les morphologies grâce à sa coupe fluide et sa matière premium.
                                Associez-la à des baskets l'après-midi ou des talons en soirée : elle vous suivra partout.
                            </p>
                        </div>

                        {/* 5. Section "La marque / l’engagement" */}
                        <div className="mt-12 mb-12 border-y border-zinc-100 py-8">
                            <h3 className="font-serif text-xl text-center mb-6">L'Excellence & Le Confort</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="mb-2 text-2xl">🌿</div>
                                    <h4 className="font-bold text-xs uppercase mb-1">Matières Nobles</h4>
                                    <p className="text-xs text-zinc-500">Sélectionnées pour durer</p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">✂️</div>
                                    <h4 className="font-bold text-xs uppercase mb-1">Coupe Parfaite</h4>
                                    <p className="text-xs text-zinc-500">Testée sur toutes tailles</p>
                                </div>
                                <div>
                                    <div className="mb-2 text-2xl">🇪🇺</div>
                                    <h4 className="font-bold text-xs uppercase mb-1">Made in Europe</h4>
                                    <p className="text-xs text-zinc-500">Savoir-faire éthique</p>
                                </div>
                            </div>
                        </div>


                        <div id="reviews" className="mt-8 pt-6 border-t border-zinc-100">
                            {/* 7. Avis clients (Optimized Header) */}
                            <div className="bg-zinc-50 p-4 rounded-lg mb-6 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-zinc-900">{reviewsData?.stats?.averageRating || product.averageRating || 0}</span>
                                            <span className="text-sm text-zinc-500">/ 5</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-zinc-600 mt-1">
                                            <span className="font-bold">
                                                {(reviewsData?.stats?.averageRating || product.averageRating || 0) >= 4 ? '95%' : '85%'}
                                            </span> des clientes recommandent ce produit
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex text-amber-500 mb-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={star <= Math.round(reviewsData?.stats?.averageRating || product.averageRating || 0) ? 'text-amber-500' : 'text-zinc-200'}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-zinc-400">Basé sur {reviewsData?.stats?.totalReviews || product.reviewsCount || 0} avis</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4 flex items-center gap-2">
                                Derniers avis
                            </h3>

                            {/* Reviews List (Vertical in column) */}
                            <div className="space-y-6">
                                {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                                    reviewsData.reviews.slice(0, 5).map((review: Review) => (
                                        <div key={review.id} className="border-b border-zinc-50 pb-6 last:border-0 relative">
                                            {/* Top Row: Name + Badge + Stars (Right) */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-zinc-900">
                                                        {review.customer ? `${review.customer.firstName} ${review.customer.lastName.charAt(0)}.` : getPersistentName(review.id)}
                                                    </span>
                                                    {review.verifiedPurchase && (
                                                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium tracking-tight">Achat vérifié</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <svg key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-amber-400' : 'text-zinc-200'} fill-current`} viewBox="0 0 24 24">
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Second Row: Date + Title */}
                                            <div className="flex justify-between items-center mb-2">
                                                {review.title && <span className="text-sm font-medium text-zinc-900">{review.title}</span>}
                                                <span className="text-xs text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                                                {review.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500">Aucun avis pour le moment.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>


                {/* L. "Vous pourriez aussi aimer" */}
                {/* Story Section */}
                <section className="mt-20 border-t border-zinc-100 pt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] w-full overflow-hidden rounded-sm bg-zinc-100">
                            <Image
                                src="/story-image.png"
                                alt="Mère et fille travaillant dans l'atelier"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">Notre Histoire</span>
                            <h2 className="mb-6 text-3xl font-serif text-zinc-900">
                                Plus qu'une Marque,<br /> <span className="italic text-[#a1b8ff]">Un Héritage.</span>
                            </h2>
                            <div className="space-y-6 text-zinc-600 font-light leading-relaxed text-sm">
                                <p>
                                    Chez Tsniout, chaque pièce raconte une histoire de transmission. C'est dans notre atelier familial, entre les mains expertes d'une mère et le regard moderne de sa fille, que naissent nos collections.
                                </p>
                                <p>
                                    Nous croyons que la modestie n'est pas une contrainte, mais l'expression ultime de l'élégance. Chaque tissu est choisi avec amour, chaque coupe est pensée pour sublimer la femme tout en respectant ses valeurs.
                                </p>
                                <p>
                                    Porter Tsniout, c'est rejoindre une lignée de femmes qui ne font aucun compromis entre leur foi et leur style.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-[#a1b8ff] hover:text-[#8da0ef] transition-colors">
                                    En savoir plus sur l'atelier →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* L. "Vous pourriez aussi aimer" (Optimized) */}
                <RelatedProducts currentProductId={product.id} />

                {/* 8. Reassurance Section - Premium Redesign */}
                <div className="mt-20 border-t border-b border-zinc-100 bg-zinc-50/50 -mx-6 px-6 py-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    ),
                                    title: "Expédition 24h",
                                    description: "Commande traitée rapidement"
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ),
                                    title: "Paiement Sûr",
                                    description: "100% Sécurisé via Stripe"
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    ),
                                    title: "Retours 30j",
                                    description: "Simple et gratuit"
                                },
                                {
                                    icon: (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    ),
                                    title: "Livraison 2-4j",
                                    description: "Partout en France & Europe"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="flex flex-col items-center text-center sm:items-start sm:text-left group">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-100 transition-all group-hover:scale-110 group-hover:shadow-md">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-zinc-500 font-light leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
