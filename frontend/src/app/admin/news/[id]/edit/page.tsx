'use client';

import { use, useEffect, useState } from 'react';
import NewsArticleForm from '@/components/admin/news-article-form';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminNewsApi } from '@/lib/api/admin-news';
import type { AdminNewsArticle } from '@/lib/data/news-articles';

export default function EditNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useAdminAuth();
    const [article, setArticle] = useState<AdminNewsArticle | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;
        adminNewsApi.getArticle(id, token)
            .then(setArticle)
            .catch(() => setError('Impossible de charger cette actualite'));
    }, [token, id]);

    if (!token || (!article && !error)) {
        return <div className="p-8 text-zinc-500">Chargement...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Modifier l actualite</h1>
                <p className="mt-1 text-zinc-500">Mettez a jour le contenu FR/EN, l image ou le PDF.</p>
            </div>
            <NewsArticleForm token={token} article={article || undefined} />
        </div>
    );
}
