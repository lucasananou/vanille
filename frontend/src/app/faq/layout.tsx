import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/faq',
        title: {
            fr: 'FAQ — Questions fréquentes sur notre vanille',
            en: 'FAQ — Frequently asked questions',
        },
        description: {
            fr: 'Questions fréquentes sur notre vanille de Madagascar : conservation des gousses, grades (TK noire, gourmet), livraison internationale, commandes B2B et paiement sécurisé.',
            en: 'Frequently asked questions about our Madagascar vanilla: pod storage, grades (black TK, gourmet), international shipping, B2B orders and secure payment.',
        },
        keywords: {
            fr: ['FAQ vanille', 'conservation vanille', 'grades vanille', 'livraison vanille Madagascar'],
            en: ['vanilla FAQ', 'vanilla storage', 'vanilla grades', 'Madagascar vanilla shipping'],
        },
    });
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
    return children;
}
