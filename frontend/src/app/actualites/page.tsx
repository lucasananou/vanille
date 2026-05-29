import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getLocalizedNewsArticle } from '@/lib/data/news-articles';
import { getPublishedNewsArticles } from '@/lib/api/news';
import { formatDate, normalizeLocale, withLocale } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/site';

async function getRequestLocale() {
    const headerStore = await headers();
    return normalizeLocale(headerStore.get('x-locale'));
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale();
    const title = locale === 'en'
        ? 'Vanilla News and Madagascar Market Updates'
        : 'Actualites vanille de Madagascar et informations marche';
    const description = locale === 'en'
        ? 'Official updates, market information, export news and international trends from the Madagascar vanilla sector.'
        : 'Arretes officiels, informations marche, export et tendances internationales de la filiere vanille de Madagascar.';

    return {
        title,
        description,
        alternates: {
            canonical: withLocale('/actualites', locale),
            languages: {
                'fr-FR': withLocale('/actualites', 'fr'),
                'en-US': withLocale('/actualites', 'en'),
            },
        },
        openGraph: {
            title,
            description,
            url: `${getSiteUrl()}${withLocale('/actualites', locale)}`,
            type: 'website',
            images: ['/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg'],
        },
    };
}

export default async function NewsPage() {
    const locale = await getRequestLocale();
    const sourceArticles = await getPublishedNewsArticles();
    const articles = sourceArticles.map((article) => getLocalizedNewsArticle(article, locale));

    return (
        <div className="min-h-screen bg-vanilla-50 text-jungle-950">
            <Header />
            <main>
                <section className="relative overflow-hidden bg-jungle-900 px-6 py-20 text-vanilla-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(210,160,74,0.22),transparent_34%),linear-gradient(135deg,rgba(10,44,29,0.92),rgba(5,22,15,1))]" />
                    <div className="relative mx-auto max-w-6xl">
                        <span className="inline-flex rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gold-300">
                            {locale === 'en' ? 'Vanilla industry intelligence' : 'Veille filiere vanille'}
                        </span>
                        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                            <div>
                                <h1 className="font-display text-4xl leading-tight md:text-6xl">
                                    {locale === 'en' ? 'News from Madagascar vanilla' : 'Actualites de la vanille de Madagascar'}
                                </h1>
                                <p className="mt-5 max-w-2xl text-lg leading-8 text-vanilla-100/78">
                                    {locale === 'en'
                                        ? 'Official orders, market signals, export updates and global trends to help customers and partners follow the vanilla sector with clarity.'
                                        : 'Arretes officiels, signaux marche, export et tendances mondiales pour informer clients et partenaires avec une lecture claire de la filiere.'}
                                </p>
                            </div>
                            <div className="rounded-3xl border border-vanilla-100/12 bg-vanilla-50/8 p-6 backdrop-blur">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                                    {locale === 'en' ? 'Covered topics' : 'Themes suivis'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {(locale === 'en'
                                        ? ['Official orders', 'Market prices', 'Export', 'Madagascar', 'Global trends']
                                        : ['Arretes officiels', 'Prix du marche', 'Export', 'Madagascar', 'Tendances mondiales']
                                    ).map((item) => (
                                        <span key={item} className="rounded-full border border-vanilla-100/15 px-3 py-1.5 text-sm text-vanilla-100/82">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-6 py-14">
                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-700">
                                {locale === 'en' ? 'Latest publications' : 'Dernieres publications'}
                            </p>
                            <h2 className="mt-2 font-display text-3xl text-jungle-950">
                                {locale === 'en' ? 'Professional monitoring for the vanilla sector' : 'Veille professionnelle de la filiere vanille'}
                            </h2>
                        </div>
                        <p className="max-w-xl text-sm leading-6 text-jungle-700/70">
                            {locale === 'en'
                                ? 'Each article highlights its source and downloadable documents whenever available.'
                                : 'Chaque publication met en avant sa source et les documents telechargeables lorsqu ils sont disponibles.'}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {articles.map((article) => (
                            <article key={article.slug} className="group overflow-hidden rounded-[2rem] border border-jungle-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <Link href={withLocale(`/actualites/${article.slug}`, locale)} className="block">
                                    <div className="relative aspect-[16/9] overflow-hidden bg-jungle-100">
                                        <Image
                                            src={article.coverImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <div className="absolute left-5 top-5 rounded-full bg-jungle-900/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-vanilla-50">
                                            {article.categoryLabel}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-jungle-600/60">
                                            <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
                                            <span>-</span>
                                            <span>{article.readTime}</span>
                                        </div>
                                        <h3 className="mt-4 font-display text-2xl leading-tight text-jungle-950 transition group-hover:text-gold-700">
                                            {article.title}
                                        </h3>
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-jungle-700/75">
                                            {article.excerpt}
                                        </p>
                                        <span className="mt-5 inline-flex text-sm font-bold text-gold-700">
                                            {locale === 'en' ? 'Read the update' : 'Lire l actualite'} →
                                        </span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
