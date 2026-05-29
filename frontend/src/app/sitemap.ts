import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/data/blog-posts';
import { NEWS_ARTICLES } from '@/lib/data/news-articles';
import { withLocale, type Locale } from '@/lib/i18n';
import { getApiUrl, getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();
    const apiUrl = getApiUrl();
    const locales: Locale[] = ['fr', 'en'];

    // Static pages
    const staticPages = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/faq',
        '/b2b',
        '/vanille-bourbon-madagascar',
        '/actualites',
        '/blog',
        '/legal/mentions-legales',
        '/legal/conditions-generales-de-vente',
        '/legal/politique-de-confidentialite',
        '/legal/politique-d-expedition',
        '/legal/politique-de-remboursement',
    ].flatMap((route) =>
        locales.map((locale) => ({
            url: `${baseUrl}${withLocale(route || '/', locale)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        })),
    );

    // Dynamic Products
    let products: any[] = [];
    try {
        const response = await fetch(`${apiUrl}/store/products?take=1000`, {
            next: { revalidate: 3600 },
        });
        if (response.ok) {
            const data = await response.json();
            products = data.data || [];
        }
    } catch (error) {
        console.error('Sitemap: Failed to fetch products', error);
    }

    const productUrls = products.flatMap((product: { slug: string; updatedAt?: string }) =>
        locales.map((locale) => ({
            url: `${baseUrl}${withLocale(`/produit/${product.slug}`, locale)}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        })),
    );

    // Hardcoded Collections (Fetching collections API if available would be better, but we know the seed ones)
    // For now, listing known collections directly or fetching if endpoint exists. 
    // Given the context, we can hardcode the main ones or try to fetch.
    // Let's stick to the known main navigation collections for now + dynamic if we had a collection API exposed in lib.
    const collections = [
        'vanille-tk-noir',
        'poivre-sauvage',
        'pack-decouverte',
        'accessoires-cuisine',
        'bijoux-accessoires'
    ];

    const collectionUrls = collections.flatMap((slug) =>
        locales.map((locale) => ({
            url: `${baseUrl}${withLocale(`/${slug}`, locale)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
    );

    // Blog posts
    const blogUrls = BLOG_POSTS.flatMap((post) =>
        locales.map((locale) => ({
            url: `${baseUrl}${withLocale(`/blog/${post.slug}`, locale)}`,
            lastModified: new Date(post.date).toISOString(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    );

    const newsUrls = NEWS_ARTICLES.flatMap((article) =>
        locales.map((locale) => ({
            url: `${baseUrl}${withLocale(`/actualites/${article.slug}`, locale)}`,
            lastModified: new Date(article.updatedAt || article.date).toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.75,
        })),
    );

    return [...staticPages, ...productUrls, ...collectionUrls, ...blogUrls, ...newsUrls];
}
