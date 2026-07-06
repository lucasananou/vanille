import type { Metadata } from 'next';
import { buildLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
    return buildLocalizedMetadata({
        path: '/telechargements',
        title: {
            fr: 'Téléchargements — Catalogue 2026, fiches techniques, certificats',
            en: 'Downloads — 2026 catalogue, technical sheets, certificates',
        },
        description: {
            fr: 'Espace de téléchargement M.S.V : catalogue 2026, fiches techniques, certificats d’analyse et documents qualité pour nos clients et partenaires professionnels.',
            en: 'M.S.V download area: 2026 catalogue, technical sheets, certificates of analysis and quality documents for our customers and professional partners.',
        },
    });
}

export default function TelechargementsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
