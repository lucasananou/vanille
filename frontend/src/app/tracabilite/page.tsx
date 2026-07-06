'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';
import { getWhatsappHref } from '@/lib/site';

const GAL = '/photos-produit-vanille/galerie-photos-qui-sommes-nous';

export default function TracabilitePage() {
    const { locale } = useLocale();
    const isEn = locale === 'en';
    const whatsappHref = getWhatsappHref(locale);

    const steps = [
        {
            n: '01',
            image: `${GAL}/fleur-de-vanille.jpg`,
            title: isEn ? 'Pollination & flowering' : 'Pollinisation & floraison',
            desc: isEn
                ? 'Each vanilla flower is hand-pollinated on our plantations in Marodoka, Ambanoro Marodoka and Befitina.'
                : 'Chaque fleur de vanille est pollinisée à la main sur nos plantations de Marodoka, Ambanoro Marodoka et Befitina.',
        },
        {
            n: '02',
            image: `${GAL}/bourgeon-de-vanille.jpg`,
            title: isEn ? 'Green vanilla harvest' : 'Récolte de la vanille verte',
            desc: isEn
                ? 'Pods are harvested at optimal maturity, the guarantee of a rich aromatic potential.'
                : "Les gousses sont récoltées à maturité optimale, gage d'un potentiel aromatique élevé.",
        },
        {
            n: '03',
            image: `${GAL}/etuvage.jpg`,
            title: isEn ? 'Scalding & sweating' : 'Échaudage & étuvage',
            desc: isEn
                ? 'The traditional step that triggers the development of colour, suppleness and aroma.'
                : "L'étape traditionnelle qui déclenche le développement de la couleur, de la souplesse et de l'arôme.",
        },
        {
            n: '04',
            image: `${GAL}/sechage-au-soleil.jpg`,
            title: isEn ? 'Sun & rack drying' : 'Séchage au soleil & sur claie',
            desc: isEn
                ? 'Alternating sun and shade drying, patiently, to concentrate the aromas.'
                : 'Un séchage alterné au soleil puis à l’ombre, patiemment, pour concentrer les arômes.',
        },
        {
            n: '05',
            image: `${GAL}/suite-etuvage.jpg`,
            title: isEn ? 'Curing' : 'Affinage',
            desc: isEn
                ? 'Several months of curing in boxes to reach an exceptional aromatic profile.'
                : "Plusieurs mois d'affinage en malle pour atteindre un profil aromatique d'exception.",
        },
        {
            n: '06',
            image: `${GAL}/triage-et-calibrage.jpg`,
            title: isEn ? 'Sorting & grading' : 'Tri & calibrage',
            desc: isEn
                ? 'Pods are hand-sorted and graded by length and quality (Black TK / Gourmet).'
                : 'Les gousses sont triées à la main et calibrées par longueur et qualité (TK Noir / Gourmet).',
        },
        {
            n: '07',
            image: `${GAL}/vanilles-traitees.jpg`,
            title: isEn ? 'Vacuum packaging & export' : 'Conditionnement sous vide & export',
            desc: isEn
                ? 'Food-grade vacuum packaging, then export as an approved exporter since 2025 to Europe, the USA, Asia and the Gulf.'
                : "Conditionnement sous vide alimentaire, puis export en tant qu'exportateur agréé depuis 2025 vers l'Europe, les USA, l'Asie et le Golfe.",
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-jungle-900 font-sans text-vanilla-50 antialiased">
            <Header />
            <main className="flex-grow">
                {/* HERO */}
                <section className="relative overflow-hidden py-16 lg:py-24">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true" />
                    <div className="relative mx-auto max-w-4xl px-4 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-300">
                            {isEn ? 'Traceability' : 'Traçabilité'}
                        </p>
                        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                            {isEn ? 'From our plantation to your kitchen, nothing is hidden.' : 'De notre plantation à votre cuisine, rien n’est caché.'}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-vanilla-100/80">
                            {isEn
                                ? 'M.S.V is a grower, curer and exporter. We master every step, from the flower in Nosy-Be to the vacuum-sealed pod shipped worldwide.'
                                : "M.S.V est producteur, préparateur et exportateur. Nous maîtrisons chaque étape, de la fleur à Nosy-Be jusqu'à la gousse conditionnée sous vide et expédiée dans le monde entier."}
                        </p>
                    </div>
                </section>

                {/* STEPS */}
                <section className="bg-vanilla-50 text-cacao-900">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <div className="space-y-10">
                            {steps.map((step, i) => (
                                <article
                                    key={step.n}
                                    className={`grid items-center gap-6 md:grid-cols-2 ${i % 2 === 1 ? 'md:[&>figure]:order-2' : ''}`}
                                >
                                    <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-vanilla-200">
                                        <Image
                                            src={step.image}
                                            alt={`${step.title} — M.S.V Nosy-Be`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </figure>
                                    <div>
                                        <span className="font-display text-5xl text-gold-500/40">{step.n}</span>
                                        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{step.title}</h2>
                                        <p className="mt-4 text-cacao-600">{step.desc}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* TRUST BAND */}
                        <div className="mt-14 grid gap-4 sm:grid-cols-3">
                            {[
                                { v: isEn ? 'Approved exporter' : 'Exportateur agréé', l: isEn ? 'Licence obtained 24/12/2025' : 'Agrément obtenu le 24/12/2025' },
                                { v: 'Nosy-Be, Madagascar', l: isEn ? 'Head office: Hell-Ville' : 'Siège : Hell-Ville' },
                                { v: isEn ? 'Grower · Curer · Exporter' : 'Producteur · Préparateur · Exportateur', l: isEn ? 'No intermediary' : 'Sans intermédiaire' },
                            ].map((item) => (
                                <div key={item.l} className="rounded-2xl border border-gold-200 bg-gold-50 p-5 text-center">
                                    <p className="font-display text-lg text-jungle-950">{item.v}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-cacao-500">{item.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-jungle-950 py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <h2 className="font-display text-3xl">
                            {isEn ? 'Professional partners: talk to us about your needs.' : 'Partenaires professionnels : parlons de vos besoins.'}
                        </h2>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link href={withLocale('/notre-plantation', locale)} className="inline-flex items-center justify-center gap-2 rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-semibold text-vanilla-50 transition hover:bg-white/10">
                                {isEn ? 'See our plantation' : 'Voir notre plantation'}
                            </Link>
                            <Link href={withLocale('/b2b', locale)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-jungle-900 transition hover:opacity-90">
                                {isEn ? 'Request a quote' : 'Demander un devis'}
                            </Link>
                            {whatsappHref ? (
                                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                                    WhatsApp
                                </a>
                            ) : null}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
