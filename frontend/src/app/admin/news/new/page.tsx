'use client';

import NewsArticleForm from '@/components/admin/news-article-form';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function NewNewsArticlePage() {
    const { token } = useAdminAuth();

    if (!token) {
        return <div className="p-8 text-zinc-500">Session admin en cours de verification...</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Nouvelle actualite</h1>
                <p className="mt-1 text-zinc-500">Ajoutez un article FR/EN avec image et PDF.</p>
            </div>
            <NewsArticleForm token={token} />
        </div>
    );
}
