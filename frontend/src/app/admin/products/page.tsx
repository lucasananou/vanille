'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminProductsApi } from '@/lib/api/admin-products';
import type { Product } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

export default function AdminProductsPage() {
    const { token } = useAdminAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const fetchProducts = async () => {
        if (!token) return;

        try {
            const response = await adminProductsApi.getProducts(token, { search });
            // Handle different response formats
            if (Array.isArray(response)) {
                setProducts(response);
            } else if (response && (response as any).data) {
                setProducts((response as any).data);
            } else if (response && (response as any).products) {
                // Fallback for old structure if needed, but we updated the service
                setProducts((response as any).products);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Impossible de charger les produits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        if (!token) return;

        try {
            await adminProductsApi.deleteProduct(id, token);
            setProducts(products.filter(p => p.id !== id));
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } catch (err) {
            alert('Échec de la suppression du produit');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} produits ?`)) return;
        if (!token) return;

        setIsDeletingBulk(true);
        try {
            await adminProductsApi.deleteBulkProducts(selectedIds, token);
            setProducts(products.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            alert('Produits supprimés avec succès');
        } catch (err) {
            console.error('Bulk delete failed:', err);
            alert('Échec de la suppression groupée');
        } finally {
            setIsDeletingBulk(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Produits</h1>
                    <p className="mt-1 text-zinc-500">Gérez votre catalogue de produits</p>
                </div>
                <div className="flex items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeletingBulk}
                            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition border border-red-200"
                        >
                            {isDeletingBulk ? 'Suppression...' : `Supprimer (${selectedIds.length})`}
                        </button>
                    )}
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter un produit
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher des produits..."
                        className="flex-1 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Rechercher
                    </button>
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Chargement des produits...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-600">{error}</div>
                ) : products.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-zinc-500 mb-4">Aucun produit trouvé</p>
                        <Link
                            href="/admin/products/new"
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Créez votre premier produit →
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedIds.length === products.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Aperçu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Produit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Prix
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {products.map((product) => (
                                <tr key={product.id} className={`hover:bg-zinc-50 transition ${selectedIds.includes(product.id) ? 'bg-indigo-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative w-12 h-16 bg-zinc-100 rounded-sm overflow-hidden border border-zinc-200">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                                                    N/A
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-900 line-clamp-1">{product.title}</div>
                                        <div className="text-sm text-zinc-500">{product.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                                        {(product.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${product.published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-zinc-100 text-zinc-800'
                                                }`}
                                        >
                                            {product.published ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Produits totaux</p>
                    <p className="text-2xl font-bold text-zinc-900">{products.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Publiés</p>
                    <p className="text-2xl font-bold text-green-600">
                        {products.filter(p => p.published).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Brouillons</p>
                    <p className="text-2xl font-bold text-zinc-600">
                        {products.filter(p => !p.published).length}
                    </p>
                </div>
            </div>
        </div>
    );
}
