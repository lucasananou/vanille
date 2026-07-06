import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/tracabilite',
        title: {
            fr: 'Traçabilité — De la plantation de Nosy-Be à l’export',
            en: 'Traceability — From the Nosy-Be plantation to export',
        },
        description: {
            fr: "La traçabilité complète de la vanille M.S.V, étape par étape : pollinisation, récolte, échaudage, séchage, affinage, tri et conditionnement sous vide, jusqu'à l'export. Producteur agréé de Nosy-Be, Madagascar.",
            en: 'The full traceability of M.S.V vanilla, step by step: pollination, harvest, scalding, drying, curing, sorting and vacuum packaging, all the way to export. Approved grower in Nosy-Be, Madagascar.',
        },
        keywords: {
            fr: ['traçabilité vanille', 'vanille Madagascar plantation export', 'agrément exportateur vanille', 'process vanille Nosy-Be'],
            en: ['vanilla traceability', 'Madagascar vanilla plantation to export', 'vanilla exporter licence', 'Nosy-Be vanilla process'],
        },
    });
}

export default function TracabiliteLayout({ children }: { children: React.ReactNode }) {
    return children;
}
