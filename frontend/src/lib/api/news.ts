import { getApiUrl } from '@/lib/site';
import {
    NEWS_ARTICLES,
    adminNewsToPublicArticle,
    getNewsArticleBySlug,
    type AdminNewsArticle,
    type NewsArticle,
} from '@/lib/data/news-articles';

export async function getPublishedNewsArticles(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(`${getApiUrl()}/store/news`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json() as AdminNewsArticle[];
        if (!Array.isArray(data) || data.length === 0) {
            return NEWS_ARTICLES;
        }

        return data.map(adminNewsToPublicArticle);
    } catch (error) {
        console.error('Failed to fetch published news articles:', error);
        return NEWS_ARTICLES;
    }
}

export async function getPublishedNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
    try {
        const response = await fetch(`${getApiUrl()}/store/news/${slug}`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json() as AdminNewsArticle;
        return adminNewsToPublicArticle(data);
    } catch (error) {
        console.error('Failed to fetch published news article:', error);
        return getNewsArticleBySlug(slug);
    }
}
