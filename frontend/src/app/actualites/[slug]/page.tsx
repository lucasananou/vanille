import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
    NEWS_ARTICLES,
    getLocalizedNewsArticle,
} from '@/lib/data/news-articles';
import { getPublishedNewsArticleBySlug } from '@/lib/api/news';
import { formatDate, normalizeLocale, withLocale } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/site';

interface NewsArticlePageProps {
    params: Promise<{ slug: string }>;
}

async function getRequestLocale() {
    const headerStore = await headers();
    return normalizeLocale(headerStore.get('x-locale'));
}

export function generateStaticParams() {
    return NEWS_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const locale = await getRequestLocale();
    const sourceArticle = await getPublishedNewsArticleBySlug(slug);

    if (!sourceArticle) {
        return {
            title: locale === 'en' ? 'News not found' : 'Actualite non trouvee',
        };
    }

    const article = getLocalizedNewsArticle(sourceArticle, locale);

    return {
        title: article.title,
        description: article.excerpt,
        alternates: {
            canonical: withLocale(`/actualites/${article.slug}`, locale),
            languages: {
                'fr-FR': withLocale(`/actualites/${article.slug}`, 'fr'),
                'en-US': withLocale(`/actualites/${article.slug}`, 'en'),
            },
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${getSiteUrl()}${withLocale(`/actualites/${article.slug}`, locale)}`,
            type: 'article',
            publishedTime: article.date,
            modifiedTime: article.updatedAt,
            images: [
                {
                    url: article.coverImage,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
    };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
    const { slug } = await params;
    const locale = await getRequestLocale();
    const sourceArticle = await getPublishedNewsArticleBySlug(slug);

    if (!sourceArticle) {
        notFound();
    }

    const article = getLocalizedNewsArticle(sourceArticle, locale);
    const relatedArticles = NEWS_ARTICLES
        .filter((entry) => entry.slug !== article.slug)
        .map((entry) => getLocalizedNewsArticle(entry, locale))
        .slice(0, 3);

    const articleUrl = `${getSiteUrl()}${withLocale(`/actualites/${article.slug}`, locale)}`;

    return (
        <div className="min-h-screen bg-vanilla-50 text-jungle-950">
            <Header />
            <main>
                <article>
                    <header className="relative overflow-hidden bg-jungle-900 px-6 py-16 text-vanilla-50 md:py-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(210,160,74,0.2),transparent_34%),linear-gradient(135deg,rgba(10,44,29,0.95),rgba(4,18,12,1))]" />
                        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                            <div>
                                <Link href={withLocale('/actualites', locale)} className="text-sm font-bold uppercase tracking-[0.2em] text-gold-300 transition hover:text-gold-200">
                                    ← {locale === 'en' ? 'Back to news' : 'Retour aux actualites'}
                                </Link>
                                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-vanilla-100/70">
                                    <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-gold-300">
                                        {article.categoryLabel}
                                    </span>
                                    <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
                                    <span>{article.readTime}</span>
                                </div>
                                <p className="mt-8 text-sm font-bold uppercase tracking-[0.24em] text-gold-300">
                                    {article.heroEyebrow}
                                </p>
                                <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                                    {article.title}
                                </h1>
                                <p className="mt-6 max-w-2xl text-lg leading-8 text-vanilla-100/78">
                                    {article.excerpt}
                                </p>
                            </div>

                            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-vanilla-100/12 bg-jungle-800 shadow-2xl">
                                <Image
                                    src={article.coverImage}
                                    alt={article.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </header>

                    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="rounded-[2rem] border border-jungle-900/10 bg-white p-6 shadow-sm md:p-10">
                            <div className="space-y-6 text-base leading-8 text-jungle-800/82">
                                {article.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>

                            <div className="mt-10 rounded-3xl border border-gold-200 bg-gold-50 p-6">
                                <h2 className="font-display text-2xl text-jungle-950">{article.keyPointsTitle}</h2>
                                <ul className="mt-5 space-y-3">
                                    {article.keyPoints.map((point) => (
                                        <li key={point} className="flex gap-3 text-sm leading-6 text-jungle-800">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-600" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-10 border-t border-jungle-900/10 pt-8">
                                <h2 className="font-display text-2xl text-jungle-950">{article.ctaTitle}</h2>
                                <p className="mt-3 text-base leading-7 text-jungle-700/76">{article.ctaText}</p>
                            </div>
                        </div>

                        <aside className="space-y-5">
                            <div className="rounded-[2rem] border border-jungle-900/10 bg-white p-6 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-jungle-500">
                                    {article.sourceLabel}
                                </p>
                                <p className="mt-3 font-semibold text-jungle-950">{article.sourceName}</p>
                                {article.documentUrl ? (
                                    <a
                                        href={article.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-jungle-900 px-5 py-3 text-sm font-bold text-vanilla-50 transition hover:bg-jungle-800"
                                    >
                                        {article.pdfLabel}
                                    </a>
                                ) : null}
                            </div>

                            <div className="rounded-[2rem] border border-gold-200 bg-gold-50 p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700">
                                    {locale === 'en' ? 'Professional note' : 'Note professionnelle'}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-jungle-800">
                                    {locale === 'en'
                                        ? 'M.S.V-Nosy Be shares official and market information to support transparent, informed relationships with customers and partners.'
                                        : 'M.S.V-Nosy Be partage les informations officielles et marche pour soutenir une relation transparente avec ses clients et partenaires.'}
                                </p>
                            </div>
                        </aside>
                    </section>
                </article>

                {relatedArticles.length > 0 ? (
                    <section className="border-t border-jungle-900/10 bg-white px-6 py-14">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="font-display text-3xl text-jungle-950">
                                {locale === 'en' ? 'More vanilla updates' : 'Autres actualites vanille'}
                            </h2>
                            <div className="mt-8 grid gap-6 md:grid-cols-3">
                                {relatedArticles.map((related) => (
                                    <Link key={related.slug} href={withLocale(`/actualites/${related.slug}`, locale)} className="group rounded-3xl border border-jungle-900/10 p-5 transition hover:border-gold-300 hover:bg-gold-50">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">{related.categoryLabel}</p>
                                        <h3 className="mt-3 font-display text-xl leading-tight text-jungle-950 group-hover:text-gold-700">{related.title}</h3>
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-jungle-700/70">{related.excerpt}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null}

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'NewsArticle',
                            headline: article.title,
                            description: article.excerpt,
                            image: `${getSiteUrl()}${article.coverImage}`,
                            datePublished: article.date,
                            dateModified: article.updatedAt || article.date,
                            mainEntityOfPage: articleUrl,
                            publisher: {
                                '@type': 'Organization',
                                name: 'M.S.V-NOSY BE',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: `${getSiteUrl()}/logo_msv.png`,
                                },
                            },
                        }),
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}
