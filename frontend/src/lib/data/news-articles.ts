import type { Locale } from '@/lib/i18n';

export type NewsCategory = 'official' | 'market' | 'export' | 'international' | 'madagascar';

export interface LocalizedNewsContent {
    title: string;
    excerpt: string;
    categoryLabel: string;
    readTime: string;
    heroEyebrow: string;
    sourceLabel: string;
    pdfLabel: string;
    keyPointsTitle: string;
    keyPoints: string[];
    paragraphs: string[];
    ctaTitle: string;
    ctaText: string;
}

export interface NewsArticle {
    slug: string;
    date: string;
    updatedAt?: string;
    category: NewsCategory;
    coverImage: string;
    documentUrl?: string;
    sourceName: string;
    content: Record<Locale, LocalizedNewsContent>;
}

export interface AdminNewsArticle {
    id?: string;
    slug: string;
    category: string;
    coverImage?: string | null;
    documentUrl?: string | null;
    sourceName: string;
    published: boolean;
    publishedAt: string;
    titleFr: string;
    titleEn: string;
    excerptFr: string;
    excerptEn: string;
    categoryLabelFr?: string | null;
    categoryLabelEn?: string | null;
    readTimeFr?: string | null;
    readTimeEn?: string | null;
    heroEyebrowFr?: string | null;
    heroEyebrowEn?: string | null;
    sourceLabelFr?: string | null;
    sourceLabelEn?: string | null;
    pdfLabelFr?: string | null;
    pdfLabelEn?: string | null;
    keyPointsTitleFr?: string | null;
    keyPointsTitleEn?: string | null;
    keyPointsFr: string[];
    keyPointsEn: string[];
    paragraphsFr: string[];
    paragraphsEn: string[];
    ctaTitleFr?: string | null;
    ctaTitleEn?: string | null;
    ctaTextFr?: string | null;
    ctaTextEn?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
    {
        slug: 'arrete-18280-2026-campagne-vanille-verte-sofia-diana-anosy',
        date: '2026-05-29',
        updatedAt: '2026-05-29',
        category: 'official',
        coverImage: '/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg',
        documentUrl: '/documents/arrete-18280-2026-campagne-vanille-verte-sofia-diana-anosy.pdf',
        sourceName: 'Arrete interministeriel n18280/2026',
        content: {
            fr: {
                title: 'Arrete n18280/2026 - Ouverture de la campagne vanille verte 2026-2027',
                excerpt:
                    'Les regions SOFIA, DIANA et ANOSY sont concernees par l ouverture de la campagne de commercialisation de la vanille verte 2026-2027 a Madagascar.',
                categoryLabel: 'Actualite officielle',
                readTime: '3 min',
                heroEyebrow: 'Filiere vanille Madagascar',
                sourceLabel: 'Source officielle',
                pdfLabel: 'Telecharger l arrete PDF',
                keyPointsTitle: 'Points a retenir',
                keyPoints: [
                    'La commercialisation de la vanille verte est encadree par arrete interministeriel.',
                    'Les regions SOFIA, DIANA et ANOSY sont mentionnees pour la campagne 2026-2027.',
                    'Ces mesures visent a proteger la maturite, la qualite et la tracabilite de la vanille malgache.',
                ],
                paragraphs: [
                    'La campagne de commercialisation de la vanille verte a Madagascar fait l objet d un encadrement officiel afin de garantir une recolte arrivee a maturite et de preserver la reputation internationale de la vanille malgache.',
                    'L arrete n18280/2026 relatif a l ouverture de la campagne vanille verte 2026-2027 concerne notamment les regions SOFIA, DIANA et ANOSY. Ce type de decision permet aux producteurs, collecteurs, exportateurs et partenaires internationaux de suivre un calendrier commun.',
                    'Pour M.S.V-Nosy Be Madagascar, le suivi de ces informations officielles est essentiel: il participe a la transparence de la filiere, a la selection de produits de qualite et a l information des clients professionnels comme particuliers.',
                ],
                ctaTitle: 'Pourquoi suivre ces actualites ?',
                ctaText:
                    'Les arretes, informations ministerielles et tendances du marche donnent une lecture plus claire des conditions de recolte, des volumes disponibles et de la qualite attendue sur chaque campagne.',
            },
            en: {
                title: 'Order n18280/2026 - Opening of the 2026-2027 green vanilla campaign',
                excerpt:
                    'The SOFIA, DIANA and ANOSY regions are covered by the opening of Madagascar s 2026-2027 green vanilla marketing campaign.',
                categoryLabel: 'Official update',
                readTime: '3 min read',
                heroEyebrow: 'Madagascar vanilla industry',
                sourceLabel: 'Official source',
                pdfLabel: 'Download the official PDF',
                keyPointsTitle: 'Key takeaways',
                keyPoints: [
                    'Green vanilla marketing in Madagascar is regulated by interministerial orders.',
                    'The SOFIA, DIANA and ANOSY regions are mentioned for the 2026-2027 campaign.',
                    'These measures help protect maturity, quality and traceability across the Malagasy vanilla sector.',
                ],
                paragraphs: [
                    'Madagascar s green vanilla marketing campaigns are officially regulated to ensure that beans are harvested at the right maturity stage and to preserve the international reputation of Malagasy vanilla.',
                    'Order n18280/2026 concerning the opening of the 2026-2027 green vanilla campaign covers, in particular, the SOFIA, DIANA and ANOSY regions. This type of official decision gives producers, collectors, exporters and international partners a shared campaign calendar.',
                    'For M.S.V-Nosy Be Madagascar, monitoring official information is part of a transparent and professional approach. It supports quality selection and helps inform both retail customers and international partners.',
                ],
                ctaTitle: 'Why follow these updates?',
                ctaText:
                    'Official orders, ministry updates and market trends provide clearer visibility on harvest conditions, available volumes and expected quality for each campaign.',
            },
        },
    },
];

export function getNewsArticleBySlug(slug: string) {
    return NEWS_ARTICLES.find((article) => article.slug === slug) || null;
}

export function getLocalizedNewsArticle(article: NewsArticle, locale: Locale) {
    return {
        ...article,
        ...article.content[locale],
    };
}

export function adminNewsToPublicArticle(article: AdminNewsArticle): NewsArticle {
    return {
        slug: article.slug,
        date: article.publishedAt,
        updatedAt: article.updatedAt,
        category: (article.category || 'official') as NewsCategory,
        coverImage: article.coverImage || '/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg',
        documentUrl: article.documentUrl || undefined,
        sourceName: article.sourceName,
        content: {
            fr: {
                title: article.titleFr,
                excerpt: article.excerptFr,
                categoryLabel: article.categoryLabelFr || 'Actualite officielle',
                readTime: article.readTimeFr || '3 min',
                heroEyebrow: article.heroEyebrowFr || 'Filiere vanille Madagascar',
                sourceLabel: article.sourceLabelFr || 'Source officielle',
                pdfLabel: article.pdfLabelFr || 'Telecharger le PDF',
                keyPointsTitle: article.keyPointsTitleFr || 'Points a retenir',
                keyPoints: article.keyPointsFr || [],
                paragraphs: article.paragraphsFr || [],
                ctaTitle: article.ctaTitleFr || 'Pourquoi suivre ces actualites ?',
                ctaText: article.ctaTextFr || '',
            },
            en: {
                title: article.titleEn,
                excerpt: article.excerptEn,
                categoryLabel: article.categoryLabelEn || 'Official update',
                readTime: article.readTimeEn || '3 min read',
                heroEyebrow: article.heroEyebrowEn || 'Madagascar vanilla industry',
                sourceLabel: article.sourceLabelEn || 'Official source',
                pdfLabel: article.pdfLabelEn || 'Download the PDF',
                keyPointsTitle: article.keyPointsTitleEn || 'Key takeaways',
                keyPoints: article.keyPointsEn || [],
                paragraphs: article.paragraphsEn || [],
                ctaTitle: article.ctaTitleEn || 'Why follow these updates?',
                ctaText: article.ctaTextEn || '',
            },
        },
    };
}
