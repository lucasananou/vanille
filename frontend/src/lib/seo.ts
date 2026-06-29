import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { normalizeLocale, withLocale, type Locale } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/site';

export async function getRequestLocale(): Promise<Locale> {
    const headerStore = await headers();
    return normalizeLocale(headerStore.get('x-locale'));
}

type LocalizedText = { fr: string; en: string };
type LocalizedList = { fr: string[]; en: string[] };

/**
 * Builds bilingual (FR/EN) metadata for a static route.
 * The page title is combined with the global "%s | M.S.V-NOSY BE" template
 * defined in the root layout, so pass only the page-specific title here.
 */
export async function buildLocalizedMetadata(opts: {
    path: string; // locale-stripped path, e.g. '/shop'
    title: LocalizedText;
    description: LocalizedText;
    keywords?: LocalizedList;
    image?: string;
}): Promise<Metadata> {
    const locale = await getRequestLocale();
    const siteUrl = getSiteUrl();
    const frPath = withLocale(opts.path, 'fr');
    const enPath = withLocale(opts.path, 'en');
    const canonical = locale === 'en' ? enPath : frPath;
    const title = opts.title[locale];
    const description = opts.description[locale];
    const image = opts.image || '/logo_msv.png';

    return {
        title,
        description,
        keywords: opts.keywords?.[locale],
        alternates: {
            canonical,
            languages: {
                'fr-FR': frPath,
                'en-US': enPath,
                'x-default': frPath,
            },
        },
        openGraph: {
            type: 'website',
            locale: locale === 'en' ? 'en_US' : 'fr_FR',
            url: `${siteUrl}${canonical}`,
            siteName: 'M.S.V-NOSY BE',
            title,
            description,
            images: [{ url: image, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}
