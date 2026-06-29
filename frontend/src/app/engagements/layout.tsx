import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/engagements',
        title: {
            fr: 'Nos engagements — Qualité, transparence et impact à Nosy-Be',
            en: 'Our commitments — Quality, transparency and impact in Nosy-Be',
        },
        description: {
            fr: "Les engagements de M.S.V-Nosy Be : qualité premium, transparence, respect des producteurs, protection de l'environnement, et 10 % de nos bénéfices consacrés à des actions sociales et environnementales à Nosy-Be.",
            en: 'M.S.V-Nosy Be commitments: premium quality, transparency, respect for growers, environmental protection, and 10% of our profits dedicated to social and environmental actions in Nosy-Be.',
        },
        keywords: {
            fr: ['engagements vanille', 'vanille durable Madagascar', 'respect des producteurs', 'vanille éthique Nosy-Be'],
            en: ['vanilla commitments', 'sustainable Madagascar vanilla', 'respect for growers', 'ethical Nosy-Be vanilla'],
        },
    });
}

export default function EngagementsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
