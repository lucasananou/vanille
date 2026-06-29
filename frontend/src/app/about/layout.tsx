import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/about',
        title: {
            fr: 'À propos — Producteur de vanille à Nosy-Be',
            en: 'About — Vanilla producer in Nosy-Be',
        },
        description: {
            fr: "M.S.V-Nosy Be, producteur, préparateur et exportateur de vanille de Madagascar. Notre savoir-faire, notre traçabilité plantation→export et le terroir d'exception de Nosy-Be.",
            en: 'M.S.V-Nosy Be, grower, curer and exporter of Madagascar vanilla. Our craftsmanship, full plantation-to-export traceability and the exceptional Nosy-Be terroir.',
        },
        keywords: {
            fr: ['producteur vanille Madagascar', 'vanille Nosy-Be', 'exportateur vanille', 'savoir-faire vanille', 'traçabilité vanille'],
            en: ['Madagascar vanilla producer', 'Nosy-Be vanilla', 'vanilla exporter', 'vanilla craftsmanship', 'vanilla traceability'],
        },
    });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
