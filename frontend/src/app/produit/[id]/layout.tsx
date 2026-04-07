import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { normalizeLocale, withLocale } from '@/lib/i18n';
import { CATALOG } from '@/lib/products-data';
import { normalizeProductRef } from '@/lib/product-refs';
import { getApiUrl, getSiteUrl } from '@/lib/site';

interface ProductLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        id: string;
    }>;
}

type ProductSeoData = {
    slug: string;
    title: string;
    description?: string;
    seoTitle?: string;
    seoMetaDescription?: string;
    images?: string[];
};

async function getProductSeoData(id: string): Promise<ProductSeoData | null> {
    const normalizedId = normalizeProductRef(id);
    const apiUrl = getApiUrl();

    try {
        const response = await fetch(`${apiUrl}/store/products/${normalizedId}`, {
            next: { revalidate: 3600 },
        });

        if (response.ok) {
            return response.json();
        }
    } catch (error) {
        console.error('Product metadata fetch failed:', error);
    }

    const fallback = CATALOG.find((product) => product.id === normalizedId || product.id === id);

    if (!fallback) {
        return null;
    }

    return {
        slug: fallback.id,
        title: fallback.title,
        description: fallback.description || fallback.subtitle,
        seoTitle: fallback.title,
        seoMetaDescription: fallback.subtitle,
        images: fallback.images,
    };
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductSeoData(id);
    const siteUrl = getSiteUrl();
    const requestHeaders = await headers();
    const locale = normalizeLocale(requestHeaders.get('x-locale'));

    if (!product) {
        return {
            title: locale === 'en' ? 'Product not found' : 'Produit non trouvé',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = product.seoTitle || (locale === 'en'
        ? `${product.title} | Premium Madagascar Bourbon Vanilla`
        : `${product.title} | Vanille Bourbon Madagascar premium`);
    const description = product.seoMetaDescription || product.description || (locale === 'en'
        ? 'Discover our premium Madagascar vanilla, selected in Nosy-Be for pastry, homemade extract and refined gifting.'
        : 'Découvrez notre vanille de Madagascar premium, sélectionnée à Nosy-Be pour la pâtisserie, l’extrait maison et les cadeaux gourmands.');
    const canonicalPath = withLocale(`/produit/${product.slug}`, locale);
    const firstImage = product.images?.[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/logo_msv.png`;
    const frPath = withLocale(`/produit/${product.slug}`, 'fr');
    const enPath = withLocale(`/produit/${product.slug}`, 'en');

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
            languages: {
                fr: frPath,
                en: enPath,
            },
        },
        openGraph: {
            title,
            description,
            url: `${siteUrl}${canonicalPath}`,
            type: 'website',
            images: [
                {
                    url: firstImage,
                    width: 1200,
                    height: 1200,
                    alt: product.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [firstImage],
        },
    };
}

export default async function ProductLayout({ children }: ProductLayoutProps) {
    return children;
}
