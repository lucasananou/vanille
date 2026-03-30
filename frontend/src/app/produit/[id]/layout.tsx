import type { Metadata } from 'next';
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

    if (!product) {
        return {
            title: 'Produit non trouvé',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = product.seoTitle || `${product.title} | Vanille Bourbon Madagascar premium`;
    const description = product.seoMetaDescription || product.description || 'Découvrez notre vanille de Madagascar premium, sélectionnée à Nosy-Be pour la pâtisserie, l’extrait maison et les cadeaux gourmands.';
    const canonicalPath = `/produit/${product.slug}`;
    const firstImage = product.images?.[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/logo_msv.png`;

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
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

