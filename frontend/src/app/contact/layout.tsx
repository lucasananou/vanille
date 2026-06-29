import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/contact',
        title: {
            fr: 'Contact — M.S.V Nosy-Be',
            en: 'Contact — M.S.V Nosy-Be',
        },
        description: {
            fr: 'Contactez M.S.V-Nosy Be pour vos achats de vanille de Madagascar, vos devis B2B et toute question. Réponse rapide par email, téléphone ou WhatsApp.',
            en: 'Contact M.S.V-Nosy Be for Madagascar vanilla orders, B2B quotes and any question. Fast reply by email, phone or WhatsApp.',
        },
        keywords: {
            fr: ['contact vanille Madagascar', 'devis vanille', 'acheter vanille Nosy-Be', 'WhatsApp vanille'],
            en: ['contact Madagascar vanilla', 'vanilla quote', 'buy Nosy-Be vanilla', 'vanilla WhatsApp'],
        },
    });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
