import { MetadataRoute } from 'next';
import { productsApi } from '@/lib/api/products';
import { BLOG_POSTS } from '@/lib/data/blog-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tsniout-shop.fr';

    // Static pages
    const staticPages = [
        '',
        '/blog',
        '/legal/mentions-legales',
        '/legal/conditions-generales-de-vente',
        '/legal/politique-de-confidentialite',
        '/legal/politique-d-expedition',
        '/legal/politique-de-remboursement',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Products
    let products: any[] = [];
    try {
        const response = await productsApi.getProducts({ limit: 1000 });
        products = response.data || [];
    } catch (error) {
        console.error('Sitemap: Failed to fetch products', error);
    }

    const productUrls = products.map((product: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/produit/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Hardcoded Collections (Fetching collections API if available would be better, but we know the seed ones)
    // For now, listing known collections directly or fetching if endpoint exists. 
    // Given the context, we can hardcode the main ones or try to fetch.
    // Let's stick to the known main navigation collections for now + dynamic if we had a collection API exposed in lib.
    const collections = [
        'robe-tsniout',
        'jupe-longue-tsniout',
        'chemisiers-tsniout',
        'vestes-tsniout',
        'pulls-tsniout',
        'bijoux-accessoires'
    ];

    const collectionUrls = collections.map((slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // Blog posts
    const blogUrls = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...productUrls, ...collectionUrls, ...blogUrls];
}
