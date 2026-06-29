import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/b2b',
        title: {
            fr: 'Vanille en gros B2B — Devis professionnels',
            en: 'Wholesale B2B Vanilla — Professional quotes',
        },
        description: {
            fr: 'Vanille de Madagascar en gros pour les professionnels : pâtisseries, restaurants, transformateurs et marques. Demandez un devis B2B et réservez la récolte 2026 de Nosy-Be.',
            en: 'Wholesale Madagascar vanilla for professionals: bakeries, restaurants, processors and brands. Request a B2B quote and reserve the 2026 Nosy-Be harvest.',
        },
        keywords: {
            fr: ['vanille en gros', 'vanille B2B Madagascar', 'devis vanille professionnel', 'fournisseur vanille Nosy-Be', 'réserver récolte 2026'],
            en: ['wholesale vanilla', 'B2B Madagascar vanilla', 'professional vanilla quote', 'Nosy-Be vanilla supplier', 'reserve 2026 harvest'],
        },
    });
}

export default function B2bLayout({ children }: { children: React.ReactNode }) {
    return children;
}
