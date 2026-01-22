'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminProductsApi } from '@/lib/api/admin-products';
import { adminCollectionsApi } from '@/lib/api/admin-collections';
import type { Collection, ProductOption, ProductVariant } from '@/lib/types';
import ImageManager from '@/components/admin/image-manager';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAdminAuth();
    const productId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [collections, setCollections] = useState<Collection[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        sku: '',
        slug: '',
        price: '',
        compareAtPrice: '',
        stock: '',
        images: [] as string[],
        tags: '',
        collectionId: '',
        published: false,
        seoTitle: '',
        seoMetaDescription: '',
    });

    const [options, setOptions] = useState<Partial<ProductOption>[]>([]);
    const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);

    useEffect(() => {
        if (token) {
            fetchCollections();
        }
    }, [token]);

    useEffect(() => {
        if (productId && token) {
            fetchProduct();
        }
    }, [productId, token]);

    const fetchCollections = async () => {
        try {
            const data = await adminCollectionsApi.getCollections(token!);
            setCollections(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch collections:', err);
        }
    };

    const fetchProduct = async () => {
        try {
            const product = await adminProductsApi.getProductById(productId, token!);
            setFormData({
                title: product.title || '',
                description: product.description || '',
                sku: product.sku || '',
                slug: product.slug || '',
                price: product.price ? (product.price / 100).toString() : '',
                compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toString() : '',
                stock: product.stock?.toString() || '0',
                images: product.images || [],
                tags: product.tags?.join(', ') || '',
                collectionId: product.collectionId || '',
                published: product.published || false,
                seoTitle: product.seoTitle || '',
                seoMetaDescription: product.seoMetaDescription || '',
            });
            setOptions(product.options || []);
            setVariants(product.variants || []);
        } catch (err) {
            console.error('Failed to fetch product:', err);
            setError('Impossible de charger le produit');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddOption = () => {
        setOptions([...options, { name: '', values: [], position: options.length }]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleOptionChange = (index: number, field: keyof ProductOption, value: any) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const handleAddVariant = () => {
        setVariants([...variants, {
            title: '',
            sku: `${formData.sku}-${variants.length + 1}`,
            price: formData.price ? parseFloat(formData.price) * 100 : 0,
            stock: 0,
            options: {}
        }]);
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const generateVariants = () => {
        if (options.length === 0) return;

        // Cartesian product of option values
        const cartesian = (...a: any[]) => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

        const values = options.map(opt => (opt.values || []).filter(Boolean));
        if (values.some(v => v.length === 0)) {
            alert('Veuillez ajouter des valeurs à toutes vos options avant de générer les variantes.');
            return;
        }

        const combinations = values.length > 1 ? cartesian(...values) : values[0].map((v: any) => [v]);

        const newVariants = combinations.map((combo: string[]) => {
            const variantOptions: Record<string, string> = {};
            options.forEach((opt, i) => {
                variantOptions[opt.name!.toLowerCase()] = combo[i];
            });

            const title = combo.join(' / ');
            const sku = `${formData.sku}-${combo.join('-').toLowerCase()}`;

            return {
                title,
                sku,
                price: formData.price ? parseFloat(formData.price) * 100 : 0,
                stock: 0,
                options: variantOptions
            };
        });

        setVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        const parsePrice = (val: string) => {
            if (!val) return undefined;
            const normalized = val.replace(',', '.');
            const parsed = parseFloat(normalized);
            return isNaN(parsed) ? undefined : Math.round(parsed * 100);
        };

        try {
            const updateData = {
                title: formData.title,
                description: formData.description,
                sku: formData.sku,
                slug: formData.slug,
                price: parsePrice(formData.price),
                compareAtPrice: parsePrice(formData.compareAtPrice),
                stock: parseInt(formData.stock) || 0,
                images: formData.images,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                collectionId: formData.collectionId || undefined,
                published: formData.published,
                seoTitle: formData.seoTitle,
                seoMetaDescription: formData.seoMetaDescription,
                options: options.map(opt => ({
                    name: opt.name,
                    values: (opt.values || []).filter(Boolean),
                    position: opt.position || 0
                })),
                variants: variants.map(v => ({
                    title: v.title,
                    sku: v.sku,
                    price: v.price ? Math.round(v.price) : undefined,
                    compareAtPrice: v.compareAtPrice ? Math.round(v.compareAtPrice) : undefined,
                    stock: v.stock || 0,
                    options: v.options,
                    image: v.image
                })),
            };

            await adminProductsApi.updateProduct(productId, updateData, token!);
            router.refresh();
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.message || 'Échec de la mise à jour du produit');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-zinc-200 rounded w-48"></div>
                    <div className="h-64 bg-zinc-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/admin/products" className="text-zinc-500 hover:text-zinc-900">
                        ← Retour
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Modifier le produit</h1>
                <p className="mt-1 text-zinc-500">Mettre à jour les informations du produit</p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Informations de base</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Titre *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            required
                                            value={formData.sku}
                                            onChange={handleChange}
                                            className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                                            Slug *
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            required
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Collection
                                    </label>
                                    <select
                                        name="collectionId"
                                        value={formData.collectionId}
                                        onChange={handleChange as any}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Aucune collection</option>
                                        {collections.map((collection) => (
                                            <option key={collection.id} value={collection.id}>
                                                {collection.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Tarification</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Prix (€) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Prix de comparaison (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="compareAtPrice"
                                        step="0.01"
                                        value={formData.compareAtPrice}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inventory */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Inventaire</h2>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Quantité en stock *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-xs text-zinc-500">Note: Si vous utilisez des variantes, ce stock sera ignoré au profit du stock par variante.</p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-zinc-900">Options</h2>
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    + Ajouter une option
                                </button>
                            </div>

                            <div className="space-y-4">
                                {options.map((option, index) => (
                                    <div key={index} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 relative group">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            className="absolute top-2 right-2 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">
                                                    Nom (ex: Taille)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.name}
                                                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                                                    className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1">
                                                    Valeurs (séparées par une virgule)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.values?.join(', ') || ''}
                                                    onChange={(e) => handleOptionChange(index, 'values', e.target.value.split(',').map(v => v.trim()))}
                                                    placeholder="S, M, L"
                                                    className="w-full border border-zinc-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {options.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={generateVariants}
                                        className="w-full py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
                                    >
                                        Générer les variantes
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Variants */}
                        {variants.length > 0 && (
                            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                                <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-zinc-900">Variantes</h2>
                                    <button
                                        type="button"
                                        onClick={handleAddVariant}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        + Ajouter manuellement
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-zinc-50 text-zinc-600 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-3">Variante</th>
                                                <th className="px-6 py-3">SKU</th>
                                                <th className="px-6 py-3">Prix (€)</th>
                                                <th className="px-6 py-3">Stock</th>
                                                <th className="px-6 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200">
                                            {variants.map((variant, index) => (
                                                <tr key={index} className="hover:bg-zinc-50 transition">
                                                    <td className="px-6 py-4 font-medium text-zinc-900">
                                                        {variant.title || 'Nouvelle variante'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={variant.sku}
                                                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                            className="w-full border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={variant.price ? variant.price / 100 : ''}
                                                            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) * 100)}
                                                            className="w-32 border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={variant.stock}
                                                            onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                                                            className="w-24 border border-zinc-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveVariant(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* SEO */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">SEO</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Titre SEO
                                    </label>
                                    <input
                                        type="text"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                                        Méta Description
                                    </label>
                                    <textarea
                                        name="seoMetaDescription"
                                        rows={3}
                                        value={formData.seoMetaDescription}
                                        onChange={handleChange}
                                        className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Statut</h2>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-zinc-700">Publié</span>
                            </label>
                        </div>

                        {/* Images */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Images</h2>

                            <div>
                                <ImageManager
                                    images={formData.images}
                                    onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Tags</h2>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Tags (séparés par des virgules)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="electronics, premium, sale"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl border border-zinc-200 p-6">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>

                            <Link
                                href="/admin/products"
                                className="block w-full mt-3 text-center border border-zinc-200 py-3 rounded-lg font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                            >
                                Annuler
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
