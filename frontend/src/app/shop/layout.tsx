import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { normalizeLocale, withLocale } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const requestHeaders = await headers();
    const locale = normalizeLocale(requestHeaders.get('x-locale'));
    const title = locale === 'en'
        ? 'Premium Madagascar Vanilla Shop'
        : 'Boutique vanille Madagascar premium';
    const description = locale === 'en'
        ? 'Shop premium Madagascar vanilla pods, gift boxes and gourmet selections for home cooks and professional kitchens.'
        : 'Achetez vos gousses de vanille premium de Madagascar : vanille Bourbon, packs découverte, formats cadeaux et solutions pour particuliers et professionnels.';

    return {
        title,
        description,
        keywords: locale === 'en'
            ? [
                'Madagascar vanilla shop',
                'premium bourbon vanilla',
                'buy Madagascar vanilla',
                'gourmet vanilla beans',
            ]
            : [
                'boutique vanille Madagascar',
                'vanille bourbon Madagascar',
                'gousses de vanille premium',
                'acheter vanille Madagascar',
            ],
        alternates: {
            canonical: withLocale('/shop', locale),
            languages: {
                fr: withLocale('/shop', 'fr'),
                en: withLocale('/shop', 'en'),
            },
        },
    };
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return children;
}
