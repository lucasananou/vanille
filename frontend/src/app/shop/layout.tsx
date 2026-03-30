import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Boutique vanille Madagascar premium',
    description: 'Achetez vos gousses de vanille premium de Madagascar : vanille Bourbon, packs découverte, formats cadeaux et solutions pour particuliers et professionnels.',
    keywords: [
        'boutique vanille Madagascar',
        'vanille bourbon Madagascar',
        'gousses de vanille premium',
        'acheter vanille Madagascar',
    ],
    alternates: {
        canonical: '/shop',
    },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return children;
}

