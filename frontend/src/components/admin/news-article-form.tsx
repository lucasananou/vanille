'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminNewsApi, type AdminNewsPayload } from '@/lib/api/admin-news';
import { adminUploadApi } from '@/lib/api/admin-upload';
import type { AdminNewsArticle } from '@/lib/data/news-articles';

type NewsFormState = AdminNewsPayload;

const defaultState: NewsFormState = {
    slug: '',
    category: 'official',
    coverImage: '',
    documentUrl: '',
    sourceName: '',
    published: false,
    publishedAt: new Date().toISOString().slice(0, 10),
    titleFr: '',
    titleEn: '',
    excerptFr: '',
    excerptEn: '',
    categoryLabelFr: 'Actualite officielle',
    categoryLabelEn: 'Official update',
    readTimeFr: '3 min',
    readTimeEn: '3 min read',
    heroEyebrowFr: 'Filiere vanille Madagascar',
    heroEyebrowEn: 'Madagascar vanilla industry',
    sourceLabelFr: 'Source officielle',
    sourceLabelEn: 'Official source',
    pdfLabelFr: 'Telecharger le PDF',
    pdfLabelEn: 'Download the PDF',
    keyPointsTitleFr: 'Points a retenir',
    keyPointsTitleEn: 'Key takeaways',
    keyPointsFr: [],
    keyPointsEn: [],
    paragraphsFr: [],
    paragraphsEn: [],
    ctaTitleFr: 'Pourquoi suivre ces actualites ?',
    ctaTitleEn: 'Why follow these updates?',
    ctaTextFr: '',
    ctaTextEn: '',
};

function toTextarea(value?: string[] | null) {
    return (value || []).join('\n');
}

function fromTextarea(value: string) {
    return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function slugify(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function NewsArticleForm({
    token,
    article,
}: {
    token: string;
    article?: AdminNewsArticle;
}) {
    const router = useRouter();
    const [form, setForm] = useState<NewsFormState>({
        ...defaultState,
        ...article,
        publishedAt: article?.publishedAt ? article.publishedAt.slice(0, 10) : defaultState.publishedAt,
    });
    const [keyPointsFr, setKeyPointsFr] = useState(toTextarea(article?.keyPointsFr || defaultState.keyPointsFr));
    const [keyPointsEn, setKeyPointsEn] = useState(toTextarea(article?.keyPointsEn || defaultState.keyPointsEn));
    const [paragraphsFr, setParagraphsFr] = useState(toTextarea(article?.paragraphsFr || defaultState.paragraphsFr));
    const [paragraphsEn, setParagraphsEn] = useState(toTextarea(article?.paragraphsEn || defaultState.paragraphsEn));
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const [error, setError] = useState('');

    const updateField = (field: keyof NewsFormState, value: string | boolean) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleImageUpload = async (file?: File) => {
        if (!file) return;
        setIsUploadingImage(true);
        setError('');
        try {
            const upload = await adminUploadApi.uploadImage(file, token);
            updateField('coverImage', upload.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload image impossible');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleDocumentUpload = async (file?: File) => {
        if (!file) return;
        setIsUploadingDocument(true);
        setError('');
        try {
            const upload = await adminUploadApi.uploadDocument(file, token);
            updateField('documentUrl', upload.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload PDF impossible');
        } finally {
            setIsUploadingDocument(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsSaving(true);

        const payload: AdminNewsPayload = {
            ...form,
            slug: form.slug || slugify(form.titleFr || form.titleEn),
            publishedAt: new Date(form.publishedAt).toISOString(),
            keyPointsFr: fromTextarea(keyPointsFr),
            keyPointsEn: fromTextarea(keyPointsEn),
            paragraphsFr: fromTextarea(paragraphsFr),
            paragraphsEn: fromTextarea(paragraphsEn),
        };

        try {
            if (article?.id) {
                await adminNewsApi.updateArticle(article.id, payload, token);
            } else {
                await adminNewsApi.createArticle(payload, token);
            }
            router.push('/admin/news');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Impossible d enregistrer l actualite.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            <section className="rounded-xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Publication</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Titre FR</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.titleFr} onChange={(e) => updateField('titleFr', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Title EN</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.titleEn} onChange={(e) => updateField('titleEn', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Slug</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.slug} onChange={(e) => updateField('slug', slugify(e.target.value))} placeholder="auto si vide" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Date de publication</span>
                        <input type="date" className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.publishedAt} onChange={(e) => updateField('publishedAt', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Categorie</span>
                        <select className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                            <option value="official">Officiel</option>
                            <option value="market">Marche</option>
                            <option value="export">Export</option>
                            <option value="international">International</option>
                            <option value="madagascar">Madagascar</option>
                        </select>
                    </label>
                    <label className="flex items-center gap-3 pt-8 text-sm font-medium text-zinc-700">
                        <input type="checkbox" checked={form.published} onChange={(e) => updateField('published', e.target.checked)} />
                        Publier l article
                    </label>
                </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Resume et source</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Resume FR</span>
                        <textarea className="mt-2 min-h-28 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.excerptFr} onChange={(e) => updateField('excerptFr', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Summary EN</span>
                        <textarea className="mt-2 min-h-28 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.excerptEn} onChange={(e) => updateField('excerptEn', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Source</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.sourceName} onChange={(e) => updateField('sourceName', e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">URL image</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.coverImage || ''} onChange={(e) => updateField('coverImage', e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Uploader image</span>
                        <input type="file" accept="image/*" className="mt-2 w-full text-sm" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                        {isUploadingImage ? <span className="mt-2 block text-xs text-zinc-500">Upload image...</span> : null}
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">URL PDF</span>
                        <input className="mt-2 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.documentUrl || ''} onChange={(e) => updateField('documentUrl', e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Uploader PDF</span>
                        <input type="file" accept="application/pdf" className="mt-2 w-full text-sm" onChange={(e) => handleDocumentUpload(e.target.files?.[0])} />
                        {isUploadingDocument ? <span className="mt-2 block text-xs text-zinc-500">Upload PDF...</span> : null}
                    </label>
                </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-zinc-900">Contenu FR / EN</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Paragraphes FR, un par ligne</span>
                        <textarea className="mt-2 min-h-48 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={paragraphsFr} onChange={(e) => setParagraphsFr(e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Paragraphs EN, one per line</span>
                        <textarea className="mt-2 min-h-48 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={paragraphsEn} onChange={(e) => setParagraphsEn(e.target.value)} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Points cles FR, un par ligne</span>
                        <textarea className="mt-2 min-h-36 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={keyPointsFr} onChange={(e) => setKeyPointsFr(e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Key points EN, one per line</span>
                        <textarea className="mt-2 min-h-36 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={keyPointsEn} onChange={(e) => setKeyPointsEn(e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Conclusion FR</span>
                        <textarea className="mt-2 min-h-24 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.ctaTextFr || ''} onChange={(e) => updateField('ctaTextFr', e.target.value)} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-zinc-700">Conclusion EN</span>
                        <textarea className="mt-2 min-h-24 w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm" value={form.ctaTextEn || ''} onChange={(e) => updateField('ctaTextEn', e.target.value)} />
                    </label>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => router.push('/admin/news')} className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                    Annuler
                </button>
                <button type="submit" disabled={isSaving || isUploadingImage || isUploadingDocument} className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
