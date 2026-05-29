'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminNewsApi } from '@/lib/api/admin-news';
import type { AdminNewsArticle } from '@/lib/data/news-articles';

export default function AdminNewsPage() {
    const { token } = useAdminAuth();
    const [articles, setArticles] = useState<AdminNewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchArticles = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            setArticles(await adminNewsApi.getArticles(token));
        } catch {
            setError('Impossible de charger les actualites');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const deleteArticle = async (id?: string) => {
        if (!id || !token) return;
        if (!confirm('Supprimer cette actualite ?')) return;
        await adminNewsApi.deleteArticle(id, token);
        setArticles((current) => current.filter((article) => article.id !== id));
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Actualites</h1>
                    <p className="mt-1 text-zinc-500">Gerez les news vanille, sources officielles, photos et PDF.</p>
                </div>
                <Link href="/admin/news/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Ajouter une actualite
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Chargement...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-600">{error}</div>
                ) : articles.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-zinc-500">Aucune actualite en base pour le moment.</p>
                        <p className="mt-2 text-sm text-zinc-400">Le site public garde le premier article en fallback.</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                            <tr>
                                <th className="px-6 py-3">Titre</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-zinc-900">{article.titleFr}</p>
                                        <p className="text-sm text-zinc-500">{article.slug}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${article.published ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-700'}`}>
                                            {article.published ? 'Publie' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3 text-sm font-medium">
                                            <Link href={`/admin/news/${article.id}/edit`} className="text-indigo-600 hover:text-indigo-700">Modifier</Link>
                                            <button onClick={() => deleteArticle(article.id)} className="text-red-600 hover:text-red-700">Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
