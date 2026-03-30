import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CATALOG } from '@/lib/products-data';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();
const featuredProducts = [
    CATALOG.find((product) => product.id === 'tk-noir-14-15'),
    CATALOG.find((product) => product.id === 'pack-decouverte'),
    CATALOG.find((product) => product.id === 'tk-noir-16'),
].filter(Boolean);

export const metadata: Metadata = {
    title: 'Vanille Bourbon Madagascar premium',
    description: 'Achetez votre vanille Bourbon de Madagascar premium : gousses sélectionnées à Nosy-Be, packs découverte, livraison France, Europe et USA.',
    alternates: {
        canonical: '/vanille-bourbon-madagascar',
    },
    openGraph: {
        title: 'Vanille Bourbon Madagascar premium',
        description: 'Gousses de vanille premium sélectionnées à Nosy-Be, avec packs découverte et livraison suivie.',
        url: `${siteUrl}/vanille-bourbon-madagascar`,
        images: [
            {
                url: `${siteUrl}/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg`,
                width: 1200,
                height: 900,
                alt: 'Vanille Bourbon Madagascar premium',
            },
        ],
    },
};

export default function VanillaLandingPage() {
    const faqItems = [
        {
            question: 'Quelle vanille choisir pour commencer ?',
            answer: 'Le format 14–15 cm est le plus polyvalent pour la pâtisserie maison. Le pack découverte est idéal pour tester plusieurs longueurs.',
        },
        {
            question: 'Livrez-vous hors de France ?',
            answer: 'Oui, la livraison est disponible en France, en Europe et aux États-Unis avec affichage du coût au checkout.',
        },
        {
            question: 'La vanille convient-elle à un usage professionnel ?',
            answer: 'Oui, nous proposons aussi des solutions B2B pour restaurateurs, pâtissiers et revendeurs.',
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
                                Vanille Bourbon de Madagascar
                            </p>
                            <h1 className="mt-6 font-display text-4xl leading-[1.04] text-vanilla-50 sm:text-5xl lg:text-6xl">
                                Des gousses premium pensées pour <span className="text-gold-500">vraiment convertir</span> vos desserts.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-relaxed text-vanilla-100/80">
                                Sélectionnées à Nosy-Be, nos gousses de vanille offrent un profil aromatique chaud, gourmand et floral, avec un conditionnement premium et une expédition suivie.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-jungle-900 transition hover:opacity-90">
                                    Découvrir la boutique
                                </Link>
                                <Link href="/produit/tk-noir-14-15" className="inline-flex items-center justify-center rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-white/10">
                                    Voir le best-seller
                                </Link>
                            </div>
                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {[
                                    'Paiement sécurisé',
                                    'Livraison France, Europe, USA',
                                    'Origine contrôlée Nosy-Be',
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
                                    alt="Gousses de vanille Bourbon de Madagascar premium"
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                            <div className="grid gap-3 p-4 sm:grid-cols-3">
                                {[
                                    'Parfum intense',
                                    'Souplesse préservée',
                                    'Conditionnement premium',
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
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">Une page pensée pour l’intention d’achat</p>
                            <h2 className="mt-4 font-display text-4xl italic">Choisissez votre format selon votre usage</h2>
                            <p className="mt-4 text-lg leading-relaxed text-jungle-800/75">
                                Pour des campagnes Google Ads rentables, nous orientons ici directement le visiteur vers les offres les plus simples à comprendre et à acheter.
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
                                    <Link href={`/produit/${product!.id}`} className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-jungle-900 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-jungle-800">
                                        Voir l’offre
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-16 text-jungle-900 lg:py-24">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
                        <div className="rounded-[2rem] border border-vanilla-200 bg-vanilla-50 p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">Réassurance</p>
                            <h2 className="mt-4 font-display text-4xl italic">Ce qui rassure avant l’achat</h2>
                            <div className="mt-8 grid gap-4">
                                {[
                                    'Prix visibles dès l’arrivée sur la page',
                                    'Livraison affichée avant la validation',
                                    'Paiement Stripe sécurisé',
                                    'Origine Madagascar clairement mise en avant',
                                ].map((item) => (
                                    <div key={item} className="rounded-2xl border border-vanilla-200 bg-white px-5 py-4 text-sm font-semibold text-jungle-900">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-jungle-900 p-8 text-vanilla-50">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-500">Professionnels et particuliers</p>
                            <h2 className="mt-4 font-display text-4xl italic">Une offre claire pour chaque besoin</h2>
                            <div className="mt-8 space-y-5 text-sm leading-relaxed text-vanilla-100/80">
                                <p>Particuliers : formats accessibles, packs découverte et idées cadeaux.</p>
                                <p>Professionnels : volumes plus importants, demandes rapides et conditions dédiées.</p>
                                <p>Chaque page produit conserve une logique simple : choix, réassurance, puis passage au panier.</p>
                            </div>
                            <Link href="/b2b" className="mt-8 inline-flex rounded-full border border-vanilla-100/15 px-6 py-3 text-sm font-bold uppercase tracking-widest text-vanilla-50 transition hover:bg-white/10">
                                Demander une offre pro
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="bg-vanilla-50 py-16 text-jungle-900 lg:py-24">
                    <div className="mx-auto max-w-4xl px-4">
                        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-gold-600">FAQ</p>
                        <h2 className="mt-4 text-center font-display text-4xl italic">Questions fréquentes avant commande</h2>
                        <div className="mt-10 space-y-4">
                            {faqItems.map((item) => (
                                <article key={item.question} className="rounded-[2rem] border border-vanilla-200 bg-white p-6">
                                    <h3 className="text-lg font-semibold text-jungle-950">{item.question}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-jungle-800/75">{item.answer}</p>
                                </article>
                            ))}
                        </div>
                        <div className="mt-10 text-center">
                            <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-jungle-900 transition hover:opacity-90">
                                Commander maintenant
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

