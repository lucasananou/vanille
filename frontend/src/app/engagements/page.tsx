'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';
import { getWhatsappHref } from '@/lib/site';

const CheckIcon = () => (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function EngagementsPage() {
    const { locale } = useLocale();
    const whatsappHref = getWhatsappHref(locale);
    const isEn = locale === 'en';

    const commitments = [
        {
            title: isEn ? 'Quality' : 'Qualité',
            desc: isEn
                ? 'Premium vanilla from Nosy-Be, hand-sorted and quality-controlled lot by lot, vacuum-sealed to preserve its aromatic richness.'
                : 'Une vanille premium de Nosy-Be, triée à la main et contrôlée lot par lot, conditionnée sous vide alimentaire pour préserver toute sa richesse aromatique.',
        },
        {
            title: isEn ? 'Transparency' : 'Transparence',
            desc: isEn
                ? 'Full traceability from the plantation to export. We are a grower, curer and exporter — not a reseller — and we share our origin clearly.'
                : "Une traçabilité complète de la plantation jusqu'à l'exportation. Nous sommes producteur, préparateur et exportateur — pas un revendeur — et nous partageons notre origine en toute clarté.",
        },
        {
            title: isEn ? 'Respect for growers' : 'Respect des producteurs',
            desc: isEn
                ? 'We work hand in hand with the growers of Nosy-Be, valuing their work and their know-how through fair and lasting relationships.'
                : "Nous travaillons main dans la main avec les planteurs de Nosy-Be, en valorisant leur travail et leur savoir-faire par des relations justes et durables.",
        },
        {
            title: isEn ? 'Protecting the environment' : "Protection de l'environnement",
            desc: isEn
                ? 'We care for the natural environment of Nosy-Be, favouring practices that respect the island and its biodiversity.'
                : "Nous prenons soin du milieu naturel de Nosy-Be, en privilégiant des pratiques respectueuses de l'île et de sa biodiversité.",
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
                            {isEn ? 'Our commitments' : 'Nos engagements'}
                        </p>
                        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                            {isEn
                                ? 'A premium vanilla, grown and shared responsibly.'
                                : 'Une vanille premium, cultivée et partagée de façon responsable.'}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-vanilla-100/80">
                            {isEn
                                ? 'At M.S.V-Nosy Be, excellence goes hand in hand with responsibility. Here are the commitments that guide us every day, from the plantation to your kitchen.'
                                : "Chez M.S.V-Nosy Be, l'excellence va de pair avec la responsabilité. Voici les engagements qui nous guident chaque jour, de la plantation jusqu'à votre cuisine."}
                        </p>
                    </div>
                </section>

                {/* COMMITMENTS */}
                <section className="bg-vanilla-50 text-cacao-900">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <div className="grid gap-6 md:grid-cols-2">
                            {commitments.map((item) => (
                                <article key={item.title} className="rounded-3xl border border-vanilla-200 bg-white p-7 transition hover:border-gold-500/40">
                                    <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500/10 text-gold-600">
                                            <CheckIcon />
                                        </span>
                                        <h2 className="font-display text-2xl">{item.title}</h2>
                                    </div>
                                    <p className="mt-4 text-cacao-600">{item.desc}</p>
                                </article>
                            ))}
                        </div>

                        {/* 10% PLEDGE */}
                        <div className="mt-10 overflow-hidden rounded-[28px] border border-gold-500/30 bg-jungle-900 text-vanilla-50">
                            <div className="grid items-center gap-8 p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
                                <div className="text-center lg:text-left">
                                    <p className="font-display text-6xl text-gold-400 lg:text-7xl">10%</p>
                                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-vanilla-100/70">
                                        {isEn ? 'of our profits' : 'de nos bénéfices'}
                                    </p>
                                </div>
                                <div>
                                    <h2 className="font-display text-2xl sm:text-3xl">
                                        {isEn ? 'Giving back to Nosy-Be' : 'Rendre à Nosy-Be'}
                                    </h2>
                                    <p className="mt-4 text-vanilla-100/80">
                                        {isEn
                                            ? 'We commit to dedicating 10% of our profits to social and environmental actions in Nosy-Be — supporting the local community and protecting the island that gives our vanilla its exceptional character.'
                                            : "Nous nous engageons à consacrer 10 % de nos bénéfices à des actions sociales et environnementales à Nosy-Be — pour soutenir la communauté locale et protéger l'île qui donne à notre vanille son caractère d'exception."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-jungle-950 py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <h2 className="font-display text-3xl">
                            {isEn ? 'Want to know more about our work?' : 'Envie d’en savoir plus sur notre démarche ?'}
                        </h2>
                        <p className="mt-4 text-vanilla-100/75">
                            {isEn
                                ? 'Talk to our team about our vanilla, our traceability and our commitments.'
                                : "Échangez avec notre équipe sur notre vanille, notre traçabilité et nos engagements."}
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link href={withLocale('/about', locale)} className="inline-flex items-center justify-center gap-2 rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-semibold text-vanilla-50 transition hover:bg-white/10">
                                {isEn ? 'Our story' : 'Notre histoire'}
                            </Link>
                            <Link href={withLocale('/contact', locale)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-jungle-900 transition hover:opacity-90">
                                {isEn ? 'Contact us' : 'Nous contacter'}
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
