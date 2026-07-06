'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocale } from '@/lib/locale-context';

// Documents téléchargeables. Déposer les fichiers dans /public/documents/
// puis renseigner `file`. Tant que `file` vaut null, l'entrée s'affiche
// en « bientôt disponible » (aucun lien mort).
const DOCUMENTS: Array<{ fr: string; en: string; file: string | null; sizeHint?: string }> = [
    {
        fr: 'Catalogue 2026',
        en: '2026 Catalogue',
        file: null, // à déposer : /public/documents/catalogue-msv-2026.pdf
    },
    {
        fr: "Certificat d'agrément exportateur",
        en: 'Export licence certificate',
        file: null, // à déposer : /public/documents/certificat-agrement-exportateur.pdf
    },
    {
        fr: 'Arrêté n°18280/2026 — campagne vanille verte',
        en: 'Order n°18280/2026 — green vanilla campaign',
        file: '/documents/arrete-18280-2026-campagne-vanille-verte-sofia-diana-anosy.pdf',
    },
    {
        fr: 'Fiches techniques produits',
        en: 'Product technical sheets',
        file: null,
    },
    {
        fr: "Certificats d'analyse",
        en: 'Certificates of analysis',
        file: null,
    },
];

const DownloadIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export default function TelechargementsPage() {
    const { locale } = useLocale();
    const isEn = locale === 'en';

    return (
        <div className="flex min-h-screen flex-col bg-jungle-900 font-sans text-vanilla-50 antialiased">
            <Header />
            <main className="flex-grow">
                <section className="relative overflow-hidden py-16 lg:py-20">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true" />
                    <div className="relative mx-auto max-w-3xl px-4 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-300">
                            {isEn ? 'Downloads' : 'Téléchargements'}
                        </p>
                        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                            {isEn ? 'Documents & resources' : 'Documents & ressources'}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-vanilla-100/80">
                            {isEn
                                ? 'Find our catalogue, technical sheets and quality certificates, added as they become available.'
                                : 'Retrouvez notre catalogue, nos fiches techniques et nos certificats qualité, ajoutés au fur et à mesure de leur disponibilité.'}
                        </p>
                    </div>
                </section>

                <section className="bg-vanilla-50 text-cacao-900">
                    <div className="mx-auto max-w-3xl px-4 py-16">
                        <ul className="space-y-4">
                            {DOCUMENTS.map((doc) => {
                                const label = isEn ? doc.en : doc.fr;
                                const available = Boolean(doc.file);
                                return (
                                    <li
                                        key={label}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-vanilla-200 bg-white p-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${available ? 'bg-gold-500/10 text-gold-600' : 'bg-vanilla-100 text-cacao-400'}`}>
                                                <DownloadIcon />
                                            </span>
                                            <div>
                                                <p className="font-semibold text-jungle-950">{label}</p>
                                                <p className="text-xs text-cacao-500">PDF</p>
                                            </div>
                                        </div>
                                        {available ? (
                                            <a
                                                href={doc.file as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-jungle-900 px-5 py-2.5 text-sm font-bold text-vanilla-50 transition hover:bg-jungle-800"
                                            >
                                                {isEn ? 'Download' : 'Télécharger'}
                                            </a>
                                        ) : (
                                            <span className="shrink-0 rounded-full border border-vanilla-200 bg-vanilla-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cacao-400">
                                                {isEn ? 'Coming soon' : 'Bientôt disponible'}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        <p className="mt-8 text-center text-sm text-cacao-500">
                            {isEn
                                ? 'Need a specific document now? Contact us and we will send it to you.'
                                : 'Besoin d’un document en particulier maintenant ? Contactez-nous, nous vous l’envoyons.'}
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
