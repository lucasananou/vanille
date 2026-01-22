import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tsniout-shop.fr';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/account/',
                '/cart',
                '/checkout',
                '/order-confirmation/',
                '/login',
                '/register',
                '/api/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
