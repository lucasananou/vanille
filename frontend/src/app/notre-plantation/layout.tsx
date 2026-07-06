import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/notre-plantation',
        title: {
            fr: 'Notre plantation — Vanille de Nosy-Be, Madagascar',
            en: 'Our plantation — Nosy-Be vanilla, Madagascar',
        },
        description: {
            fr: 'Découvrez les plantations M.S.V à Nosy-Be : environ 7 000 pieds de vanilliers à Marodoka, Ambanoro Marodoka et Befitina. Un véritable producteur malgache, créé en 2023.',
            en: 'Discover the M.S.V plantations in Nosy-Be: around 7,000 vanilla plants in Marodoka, Ambanoro Marodoka and Befitina. A genuine Madagascar grower, founded in 2023.',
        },
        keywords: {
            fr: ['plantation vanille Nosy-Be', 'producteur vanille Madagascar', 'vanilliers Nosy-Be', 'vanille Marodoka'],
            en: ['Nosy-Be vanilla plantation', 'Madagascar vanilla grower', 'Nosy-Be vanilla vines', 'Marodoka vanilla'],
        },
    });
}

export default function NotrePlantationLayout({ children }: { children: React.ReactNode }) {
    return children;
}
