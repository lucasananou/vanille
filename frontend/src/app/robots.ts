import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();
    const localeDisallowRules = [
        '/cart',
        '/checkout',
        '/order-confirmation/',
        '/login',
        '/register',
        '/account/',
    ].flatMap((path) => [path, `/fr${path}`, `/en${path}`]);

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/api/',
                ...localeDisallowRules,
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
