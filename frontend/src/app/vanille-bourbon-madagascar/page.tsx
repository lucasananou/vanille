import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { normalizeLocale, withLocale } from '@/lib/i18n';
import { CATALOG } from '@/lib/products-data';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();
const featuredProducts = [
    CATALOG.find((product) => product.id === 'tk-noir-14-15'),
    CATALOG.find((product) => product.id === 'pack-decouverte'),
    CATALOG.find((product) => product.id === 'tk-noir-16'),
].filter(Boolean);

export async function generateMetadata(): Promise<Metadata> {
    const locale = normalizeLocale((await headers()).get('x-locale'));
    const canonicalPath = withLocale('/vanille-bourbon-madagascar', locale);

    return {
        title: locale === 'en' ? 'Premium Madagascar Bourbon Vanilla' : 'Vanille Bourbon Madagascar premium',
        description: locale === 'en'
            ? 'Shop premium Madagascar Bourbon vanilla pods: hand-selected in Nosy-Be, with discovery boxes and tracked delivery across France, Europe and the USA.'
            : 'Achetez votre vanille Bourbon de Madagascar premium : gousses sélectionnées à Nosy-Be, packs découverte, livraison France, Europe et USA.',
        alternates: {
            canonical: canonicalPath,
            languages: {
                fr: withLocale('/vanille-bourbon-madagascar', 'fr'),
                en: withLocale('/vanille-bourbon-madagascar', 'en'),
            },
        },
        openGraph: {
            title: locale === 'en' ? 'Premium Madagascar Bourbon Vanilla' : 'Vanille Bourbon Madagascar premium',
            description: locale === 'en'
                ? 'Premium vanilla pods selected in Nosy-Be, with discovery sets and tracked international delivery.'
                : 'Gousses de vanille premium sélectionnées à Nosy-Be, avec packs découverte et livraison suivie.',
            url: `${siteUrl}${canonicalPath}`,
            images: [
                {
                    url: `${siteUrl}/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg`,
                    width: 1200,
                    height: 900,
                    alt: locale === 'en' ? 'Premium Madagascar Bourbon vanilla' : 'Vanille Bourbon Madagascar premium',
                },
            ],
        },
    };
}

export default async function VanillaLandingPage() {
    const locale = normalizeLocale((await headers()).get('x-locale'));
    const faqItems = [
        {
            question: locale === 'en' ? 'Which vanilla should I start with?' : 'Quelle vanille choisir pour commencer ?',
            answer: locale === 'en'
                ? 'The 14–15 cm format is the most versatile for home baking. The discovery set is ideal if you want to compare several lengths.'
                : 'Le format 14–15 cm est le plus polyvalent pour la pâtisserie maison. Le pack découverte est idéal pour tester plusieurs longueurs.',
        },
        {
            question: locale === 'en' ? 'Do you ship outside France?' : 'Livrez-vous hors de France ?',
            answer: locale === 'en'
                ? 'Yes. Shipping is available across France, Europe and the United States, with delivery costs shown before payment.'
                : 'Oui, la livraison est disponible en France, en Europe et aux États-Unis avec affichage du coût au checkout.',
        },
        {
            question: locale === 'en' ? 'Is your vanilla suitable for professional use?' : 'La vanille convient-elle à un usage professionnel ?',
            answer: locale === 'en'
                ? 'Yes. We also offer B2B solutions for chefs, pastry teams, retailers and hospitality buyers.'
                : 'Oui, nous proposons aussi des solutions B2B pour restaurateurs, pâtissiers et revendeurs.',
        },
    ];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <div className="bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />
            <main id="content">
                <section className="relative overflow-hidden bg-jungle-900">
                    <div className="absolute inset-0 grain opacity-20" aria-hidden="true"></div>
                    <div className="absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl"></div>
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-vanilla-100/10 bg-white/5 px-4 py-2 text-sm font-semibold text-vanilla-100">
                                {locale === 'en' ? 'Madagascar Bourbon Vanilla' : 'Vanille Bourbon de Madagascar'}
                            </p>
                            <h1 className="mt-6 font-display text-4xl leading-[1.04] text-vanilla-50 sm:text-5xl lg:text-6xl">
                                {locale === 'en'
                                    ? <>Premium pods designed to <span className="text-gold-500">truly elevate</span> your desserts.</>
                                    : <>Des gousses premium pensées pour <span className="text-gold-500">vraiment convertir</span> vos desserts.</>}
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-vanilla-100/80">
                                {locale === 'en'
                                    ? 'Selected in Nosy-Be, our vanilla pods offer a warm, gourmet and floral aromatic profile, with premium packaging and tracked delivery.'
                                    : 'Sélectionnées à Nosy-Be, nos gousses de vanille offrent un profil aromatique chaud, gourmand et floral, avec un conditionnement premium et une expédition suivie.'}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href={withLocale('/shop', locale)} className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-jungle-900 transition hover:opacity-90">
                                    {locale === 'en' ? 'Discover the shop' : 'Découvrir la boutique'}
                                </Link>
                                <Link href={withLocale('/produit/tk-noir-14-15', locale)} className="inline-flex items-center justify-center rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-white/10">
                                    {locale === 'en' ? 'View the best seller' : 'Voir le best-seller'}
                                </Link>
                            </div>
                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {[
                                    locale === 'en' ? 'Secure payment' : 'Paiement sécurisé',
                                    locale === 'en' ? 'Shipping France, Europe, USA' : 'Livraison France, Europe, USA',
                                    locale === 'en' ? 'Verified Nosy-Be origin' : 'Origine contrôlée Nosy-Be',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-vanilla-100/10 bg-white/5 p-4 text-sm font-semibold text-vanilla-100">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-vanilla-100/10 bg-white/5 p-4 backdrop-blur">
                            <div className="overflow-hidden rounded-[1.5rem]">
                                <img
                                    src="/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg"
                                    alt={locale === 'en' ? 'Premium Madagascar Bourbon vanilla pods' : 'Gousses de vanille Bourbon de Madagascar premium'}
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                            <div className="grid gap-3 p-4 sm:grid-cols-3">
                                {[
                                    locale === 'en' ? 'Intense aroma' : 'Parfum intense',
                                    locale === 'en' ? 'Supple texture preserved' : 'Souplesse préservée',
                                    locale === 'en' ? 'Premium packaging' : 'Conditionnement premium',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl bg-jungle-950 px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-vanilla-100">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 py-16 text-jungle-900 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">{locale === 'en' ? 'Designed for buying intent' : 'Une page pensée pour l’intention d’achat'}</p>
                            <h2 className="mt-4 font-display text-4xl italic">{locale === 'en' ? 'Choose the right format for your use case' : 'Choisissez votre format selon votre usage'}</h2>
                            <p className="mt-4 text-lg leading-relaxed text-jungle-800/75">
                                {locale === 'en'
                                    ? 'For profitable Google Ads campaigns, this page sends visitors straight to the offers that are the easiest to understand and buy.'
                                    : 'Pour des campagnes Google Ads rentables, nous orientons ici directement le visiteur vers les offres les plus simples à comprendre et à acheter.'}
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 lg:grid-cols-3">
                            {featuredProducts.map((product) => (
                                <article key={product!.id} className="rounded-[2rem] border border-vanilla-200 bg-white p-8 shadow-sm">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">{product!.grade}</p>
                                    <h3 className="mt-4 font-display text-3xl italic text-jungle-950">{product!.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-jungle-800/75">{product!.subtitle}</p>
                                    <p className="mt-6 text-3xl font-semibold text-jungle-950">{product!.price_label}</p>
                                    <ul className="mt-6 space-y-3">
                                        {product!.bullets.slice(0, 3).map((bullet) => (
                                            <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-jungle-800">
                                                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gold-500"></span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={withLocale(`/produit/${product!.id}`, locale)} className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-jungle-900 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-jungle-800">
                                        {locale === 'en' ? 'View offer' : 'Voir l’offre'}
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-16 text-jungle-900 lg:py-24">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
                        <div className="rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">{locale === 'en' ? 'Trust markers' : 'Réassurance'}</p>
                            <h2 className="mt-4 font-display text-4xl italic">{locale === 'en' ? 'What reassures buyers before checkout' : 'Ce qui rassure avant l’achat'}</h2>
                            <div className="mt-8 grid gap-4">
                                {[
                                    locale === 'en' ? 'Visible pricing from the first screen' : 'Prix visibles dès l’arrivée sur la page',
                                    locale === 'en' ? 'Shipping shown before payment' : 'Livraison affichée avant la validation',
                                    locale === 'en' ? 'Secure Stripe checkout' : 'Paiement Stripe sécurisé',
                                    locale === 'en' ? 'Madagascar origin clearly highlighted' : 'Origine Madagascar clairement mise en avant',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-vanilla-200 bg-white px-5 py-4 text-sm font-semibold text-jungle-900">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-jungle-900 p-8 text-vanilla-50">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-500">{locale === 'en' ? 'Wholesale and retail' : 'Professionnels et particuliers'}</p>
                            <h2 className="mt-4 font-display text-4xl italic">{locale === 'en' ? 'A clear offer for every need' : 'Une offre claire pour chaque besoin'}</h2>
                            <div className="mt-8 space-y-5 text-sm leading-relaxed text-vanilla-100/80">
                                <p>{locale === 'en' ? 'Retail customers: accessible formats, discovery sets and gift-ready options.' : 'Particuliers : formats accessibles, packs découverte et idées cadeaux.'}</p>
                                <p>{locale === 'en' ? 'Professionals: larger volumes, quick quote requests and dedicated terms.' : 'Professionnels : volumes plus importants, demandes rapides et conditions dédiées.'}</p>
                                <p>{locale === 'en' ? 'Each product page follows a simple structure: selection, reassurance, then add to cart.' : 'Chaque page produit conserve une logique simple : choix, réassurance, puis passage au panier.'}</p>
                            </div>
                            <Link href={withLocale('/b2b', locale)} className="mt-8 inline-flex rounded-full border border-vanilla-100/15 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-white/10">
                                {locale === 'en' ? 'Request a wholesale offer' : 'Demander une offre pro'}
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 py-16 text-jungle-900 lg:py-24">
                    <div className="mx-auto max-w-4xl px-4">
                        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-gold-600">FAQ</p>
                        <h2 className="mt-4 text-center font-display text-4xl italic">{locale === 'en' ? 'Frequently asked questions before ordering' : 'Questions fréquentes avant commande'}</h2>
                        <div className="mt-10 space-y-4">
                            {faqItems.map((item) => (
                                <article key={item.question} className="rounded-[2rem] border border-vanilla-200 bg-white p-6">
                                    <h3 className="text-lg font-semibold text-jungle-950">{item.question}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-jungle-800/75">{item.answer}</p>
                                </article>
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <Link href={withLocale('/shop', locale)} className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-jungle-900 transition hover:opacity-90">
                                {locale === 'en' ? 'Order now' : 'Commander maintenant'}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Footer />
        </div>
    );
}
