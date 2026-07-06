'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';
import { getWhatsappHref } from '@/lib/site';

const GAL = '/photos-produit-vanille/galerie-photos-qui-sommes-nous';

// Vraies photos M.S.V présentes dans le repo. Ajouter ici les nouvelles photos
// de plantation dès qu'elles sont déposées dans /public/photos-produit-vanille/.
const GALLERY = [
    { src: `${GAL}/vanillier-moridy.jpg`, fr: 'Vanillier sur la plantation M.S.V', en: 'Vanilla vine on the M.S.V plantation' },
    { src: `${GAL}/fleur-de-vanille.jpg`, fr: 'Fleur de vanille', en: 'Vanilla flower' },
    { src: `${GAL}/bourgeon-de-vanille.jpg`, fr: 'Bourgeon de vanille', en: 'Vanilla bud' },
    { src: `${GAL}/pdg-pour-site-web.jpg`, fr: 'Abou Moridy, fondateur de M.S.V', en: 'Abou Moridy, founder of M.S.V' },
    { src: `${GAL}/img_8367.jpg`, fr: 'Sur les plantations de Nosy-Be', en: 'On the Nosy-Be plantations' },
    { src: `${GAL}/img_8443.jpg`, fr: 'Culture de la vanille à Nosy-Be', en: 'Vanilla growing in Nosy-Be' },
];

export default function NotrePlantationPage() {
    const { locale } = useLocale();
    const isEn = locale === 'en';
    const whatsappHref = getWhatsappHref(locale);

    return (
        <div className="flex min-h-screen flex-col bg-jungle-900 font-sans text-vanilla-50 antialiased">
            <Header />
            <main className="flex-grow">
                {/* HERO */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src={`${GAL}/pdg-sur-le-terrain.jpg`}
                            alt="Plantation de vanille M.S.V à Nosy-Be, Madagascar"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/70 to-jungle-900/40" />
                    </div>
                    <div className="relative mx-auto max-w-4xl px-4 py-24 text-center lg:py-32">
                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold-300">
                            {isEn ? 'Our plantation' : 'Notre plantation'}
                        </p>
                        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                            {isEn ? 'A real Madagascar grower, rooted in Nosy-Be.' : 'Un véritable producteur malgache, enraciné à Nosy-Be.'}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-vanilla-100/85">
                            {isEn
                                ? 'Founded in 2023, M.S.V grows its own vanilla on the island of Nosy-Be — not a reseller, but a grower who masters the whole chain.'
                                : "Créée en 2023, M.S.V cultive sa propre vanille sur l'île de Nosy-Be — pas un revendeur, mais un producteur qui maîtrise toute la chaîne."}
                        </p>
                    </div>
                </section>

                {/* STATS */}
                <section className="bg-vanilla-50 text-cacao-900">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { v: '2023', l: isEn ? 'Founded' : 'Année de création' },
                                { v: '~7 000', l: isEn ? 'Vanilla plants' : 'Pieds de vanilliers' },
                                { v: '3', l: isEn ? 'Growing areas' : 'Zones de culture' },
                                { v: 'Nosy-Be', l: isEn ? 'Madagascar' : 'Madagascar' },
                            ].map((s) => (
                                <div key={s.l} className="rounded-2xl border border-vanilla-200 bg-white p-6 text-center">
                                    <p className="font-display text-3xl text-gold-600">{s.v}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-cacao-500">{s.l}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="font-display text-3xl">{isEn ? 'Three plantations in Nosy-Be' : 'Trois plantations à Nosy-Be'}</h2>
                                <p className="mt-4 text-cacao-600">
                                    {isEn
                                        ? 'Our vanilla grows mainly in Marodoka, Ambanoro Marodoka and Befitina — around 7,000 vanilla plants, alongside other crops such as ylang-ylang, cashew and fruit trees.'
                                        : "Notre vanille pousse principalement à Marodoka, Ambanoro Marodoka et Befitina — environ 7 000 pieds de vanilliers, aux côtés d'autres cultures comme l'ylang-ylang, les anacardiers et des arbres fruitiers."}
                                </p>
                                <ul className="mt-6 space-y-3 text-sm text-cacao-700">
                                    {[
                                        isEn ? 'Marodoka — vanilla plantation' : 'Marodoka — plantation de vanille',
                                        isEn ? 'Ambanoro Marodoka — vanilla plantation' : 'Ambanoro Marodoka — plantation de vanille',
                                        isEn ? 'Befitina — vanilla & mixed crops' : 'Befitina — vanille & cultures associées',
                                    ].map((z) => (
                                        <li key={z} className="flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-gold-500" />
                                            {z}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* GOOGLE MAP */}
                            <div className="overflow-hidden rounded-3xl border border-vanilla-200">
                                <iframe
                                    title={isEn ? 'M.S.V location in Nosy-Be' : 'Localisation M.S.V à Nosy-Be'}
                                    src="https://www.google.com/maps?q=Hell-Ville,%20Nosy-Be,%20Madagascar&output=embed"
                                    className="h-[320px] w-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* GALLERY */}
                <section className="bg-jungle-900">
                    <div className="mx-auto max-w-6xl px-4 py-16">
                        <h2 className="font-display text-3xl text-white">{isEn ? 'On the plantation' : 'Sur la plantation'}</h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {GALLERY.map((photo) => (
                                <figure key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-vanilla-100/10">
                                    <Image
                                        src={photo.src}
                                        alt={isEn ? photo.en : photo.fr}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-jungle-950 py-16">
                    <div className="mx-auto max-w-3xl px-4 text-center">
                        <h2 className="font-display text-3xl">
                            {isEn ? 'Follow the vanilla from the flower to the pod.' : 'Suivez la vanille, de la fleur à la gousse.'}
                        </h2>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link href={withLocale('/tracabilite', locale)} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-jungle-900 transition hover:opacity-90">
                                {isEn ? 'See traceability' : 'Voir la traçabilité'}
                            </Link>
                            <Link href={withLocale('/shop', locale)} className="inline-flex items-center justify-center gap-2 rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-semibold text-vanilla-50 transition hover:bg-white/10">
                                {isEn ? 'Shop the vanilla' : 'Découvrir la boutique'}
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
