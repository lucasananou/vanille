import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/blog',
        title: {
            fr: 'Blog — Vanille de Madagascar, recettes et savoir-faire',
            en: 'Journal — Madagascar vanilla, recipes and know-how',
        },
        description: {
            fr: "Conseils, recettes et histoire de la vanille de Madagascar par M.S.V-Nosy Be : conservation, pâtisserie, extrait maison et coulisses de notre plantation à Nosy-Be.",
            en: 'Tips, recipes and the story of Madagascar vanilla by M.S.V-Nosy Be: storage, pastry, homemade extract and behind the scenes of our Nosy-Be plantation.',
        },
        keywords: {
            fr: ['blog vanille', 'recettes vanille Madagascar', 'conservation vanille', 'savoir-faire vanille'],
            en: ['vanilla blog', 'Madagascar vanilla recipes', 'vanilla storage', 'vanilla know-how'],
        },
    });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
