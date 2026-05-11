'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';
import { getContactPhoneDisplay, getWhatsappHref } from '@/lib/site';

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const LeafIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.4 8.7-1.2 3.5-4 5.4-7.8 5.7L11 20z" />
        <path d="M11 20c0-3.3 4.3-4.6 11-7" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-gold-500 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function AboutPage() {
    const { locale } = useLocale();
    const whatsappHref = getWhatsappHref(locale);
    const phoneDisplay = getContactPhoneDisplay();

    return (
        <div className="flex min-h-screen flex-col bg-jungle-900 font-sans antialiased text-vanilla-50">
            <Header />

            <main id="content" className="flex-grow">
                <section className="relative overflow-hidden bg-jungle-900 pb-20">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="absolute -top-24 -left-24 h-[34rem] w-[34rem] rounded-full bg-gold-500/10 blur-3xl"></div>

                    <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-8 pt-14 lg:grid-cols-2 lg:items-center lg:pt-20">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-vanilla-50">
                                <LeafIcon />
                                <span className="text-sm font-semibold uppercase tracking-widest">
                                    {locale === 'en' ? 'About M.S.V Nosy-Be' : 'À propos de M.S.V Nosy-Be'}
                                </span>
                            </div>

                            <h1 className="mt-8 font-display text-4xl italic leading-tight sm:text-5xl lg:text-6xl">
                                {locale === 'en'
                                    ? <>A vanilla rooted in <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Nosy-Be</span>, prepared for demanding kitchens.</>
                                    : <>Une vanille enracinée à <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Nosy-Be</span>, pensée pour les cuisines exigeantes.</>}
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-vanilla-100/80">
                                {locale === 'en'
                                    ? 'M.S.V Nosy-Be is the company and operating structure behind the brand. Vanille Moridy is the commercial signature used to present the vanilla itself, its origin and its selection work.'
                                    : 'M.S.V Nosy-Be est la société et la structure d’exploitation derrière la marque. Vanille Moridy correspond à la signature commerciale utilisée pour présenter la vanille, son origine et le travail de sélection.'}
                            </p>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {[
                                    locale === 'en' ? 'Nosy-Be origin' : 'Origine Nosy-Be',
                                    locale === 'en' ? 'Hand selection' : 'Sélection à la main',
                                    locale === 'en' ? 'Direct contact' : 'Contact direct',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-vanilla-100/10 bg-white/5 px-4 py-4 text-sm font-semibold text-vanilla-50">
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link href={withLocale('/shop', locale)} className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-8 py-4 text-sm font-bold text-jungle-900 transition-all hover:opacity-90">
                                    {locale === 'en' ? 'View the shop' : 'Voir la boutique'}
                                    <ArrowRightIcon />
                                </Link>
                                {whatsappHref ? (
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white transition-all hover:opacity-90"
                                    >
                                        {locale === 'en' ? 'Talk on WhatsApp' : 'Parler sur WhatsApp'}
                                    </a>
                                ) : (
                                    <Link href={withLocale('/contact', locale)} className="inline-flex items-center justify-center gap-3 rounded-full glass px-8 py-4 text-sm font-bold text-vanilla-50 transition-all hover:bg-vanilla-50/10">
                                        {locale === 'en' ? 'Contact us' : 'Nous contacter'}
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="overflow-hidden rounded-[2.8rem] border border-vanilla-100/10 bg-vanilla-50/5 p-3">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.3rem]">
                                    <img
                                        src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/pdg-sur-le-terrain.jpg"
                                        alt={locale === 'en' ? 'Field visit in Nosy-Be' : 'Visite sur le terrain à Nosy-Be'}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/70 via-jungle-950/10 to-transparent"></div>
                                    <div className="absolute bottom-0 p-8">
                                        <p className="font-display text-3xl italic text-vanilla-50">
                                            {locale === 'en' ? 'From field to preparation' : 'Du terrain à la préparation'}
                                        </p>
                                        <p className="mt-3 max-w-md text-sm leading-relaxed text-vanilla-100/75">
                                            {locale === 'en'
                                                ? 'The site must show a real origin, a real team and a direct way to ask questions before ordering.'
                                                : 'Le site doit montrer une origine réelle, une équipe réelle et un contact direct pour poser des questions avant commande.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 py-20 text-jungle-900 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-10">
                                <div className="rounded-[2rem] border border-vanilla-200 bg-white p-8 lg:p-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                        {locale === 'en' ? 'Brand clarity' : 'Clarté de marque'}
                                    </p>
                                    <h2 className="mt-4 font-display text-3xl italic text-jungle-950">
                                        {locale === 'en' ? 'M.S.V Nosy-Be and Vanille Moridy' : 'M.S.V Nosy-Be et Vanille Moridy'}
                                    </h2>
                                    <div className="mt-6 space-y-5 text-base leading-relaxed text-jungle-800/85">
                                        <p>
                                            {locale === 'en'
                                                ? 'M.S.V Nosy-Be names the company and the production, storage and export activity based in Nosy-Be, Madagascar.'
                                                : 'M.S.V Nosy-Be désigne la société et l’activité de production, stockage et export basée à Nosy-Be, Madagascar.'}
                                        </p>
                                        <p>
                                            {locale === 'en'
                                                ? 'Vanille Moridy is the commercial expression used on the site to present the product universe, the grades and the customer-facing selection.'
                                                : 'Vanille Moridy est l’expression commerciale utilisée sur le site pour présenter l’univers produit, les grades et la sélection tournée vers le client.'}
                                        </p>
                                        <p>
                                            {locale === 'en'
                                                ? 'This distinction matters because visitors need both: a clear company identity for trust, and a readable product signature for buying.'
                                                : 'Cette distinction compte parce que les visiteurs ont besoin des deux: une identité société claire pour la confiance, et une signature produit lisible pour l’achat.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-vanilla-200 bg-white p-8 lg:p-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                        {locale === 'en' ? 'What reassures visitors' : 'Ce qui rassure les visiteurs'}
                                    </p>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        {[
                                            locale === 'en'
                                                ? 'Clear origin and company details'
                                                : 'Origine et identité société clairement présentées',
                                            locale === 'en'
                                                ? 'Visible contact by email, phone and WhatsApp'
                                                : 'Contact visible par email, téléphone et WhatsApp',
                                            locale === 'en'
                                                ? 'A readable explanation of grades and uses'
                                                : 'Une explication lisible des grades et usages',
                                            locale === 'en'
                                                ? 'Real photos of the team, production and preparation'
                                                : 'De vraies photos de l’équipe, de la production et de la préparation',
                                        ].map((item) => (
                                            <div key={item} className="flex gap-3 rounded-2xl bg-vanilla-50 p-4 text-sm leading-relaxed text-jungle-800">
                                                <CheckIcon />
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-vanilla-200 bg-white p-8 lg:p-10">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                        {locale === 'en' ? 'What still strengthens the page' : 'Ce qui renforcera encore la page'}
                                    </p>
                                    <div className="mt-6 space-y-4 text-base leading-relaxed text-jungle-800/85">
                                        <p>
                                            {locale === 'en'
                                                ? 'Real production photos, team portraits and a short founder statement would make this page much stronger.'
                                                : 'De vraies photos de production, des portraits d’équipe et un court mot du fondateur rendraient cette page beaucoup plus forte.'}
                                        </p>
                                        <p>
                                            {locale === 'en'
                                                ? 'For now, the structure is ready and the distinction between company and brand is clear.'
                                                : 'Pour l’instant, la structure est prête et la distinction entre société et marque est clarifiée.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-8">
                                <div className="rounded-[2rem] border border-vanilla-200 bg-jungle-900 p-8 text-vanilla-50">
                                    <p className="font-display text-2xl italic">
                                        {locale === 'en' ? 'Quick trust snapshot' : 'Repères de confiance'}
                                    </p>
                                    <div className="mt-6 space-y-5 text-sm leading-relaxed text-vanilla-100/80">
                                        <p>
                                            {locale === 'en'
                                                ? 'Company: MORIDY SOANJARA VANILLE NOSY-BE'
                                                : 'Société: MORIDY SOANJARA VANILLE NOSY-BE'}
                                        </p>
                                        <p>
                                            {locale === 'en'
                                                ? 'Origin: Nosy-Be, Madagascar'
                                                : 'Origine: Nosy-Be, Madagascar'}
                                        </p>
                                        <p>
                                            {locale === 'en'
                                                ? `Direct phone: ${phoneDisplay}`
                                                : `Téléphone direct: ${phoneDisplay}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[2rem] border border-gold-200 bg-gold-50 p-8">
                                    <p className="font-display text-2xl italic text-jungle-950">
                                        {locale === 'en' ? 'Need a direct answer?' : 'Besoin d’une réponse directe ?'}
                                    </p>
                                    <p className="mt-4 text-sm leading-relaxed text-jungle-800">
                                        {locale === 'en'
                                            ? 'Before ordering, ask about grade, quantity, delivery timing or a professional request.'
                                            : 'Avant commande, posez votre question sur le grade, la quantité, le délai de livraison ou une demande professionnelle.'}
                                    </p>
                                    <div className="mt-6 flex flex-col gap-3">
                                        {whatsappHref ? (
                                            <a
                                                href={whatsappHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                            >
                                                {locale === 'en' ? 'Open WhatsApp' : 'Ouvrir WhatsApp'}
                                            </a>
                                        ) : null}
                                        <Link href={withLocale('/contact', locale)} className="inline-flex items-center justify-center rounded-full border border-vanilla-200 bg-white px-5 py-3 text-sm font-semibold text-jungle-900 transition hover:border-gold-500/40">
                                            {locale === 'en' ? 'Open contact page' : 'Ouvrir la page contact'}
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
