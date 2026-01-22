'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';

interface RelatedProductsProps {
    currentProductId: string;
    collectionId?: string; // If we want to filter by collection
}

export default function RelatedProducts({ currentProductId, collectionId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            // Logic to fetch related products
            // For now, fetching "latest" or "same collection" if possible
            try {
                const params: any = { limit: 4 };
                if (collectionId) {
                    params.collection = collectionId;
                }
                const res = await productsApi.getProducts(params);
                const related = (res.data || [])
                    .filter(p => p.id !== currentProductId) // Exclude current
                    .slice(0, 4);
                setProducts(related);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentProductId, collectionId]);

    if (loading || products.length === 0) return null;

    return (
        <section className="bg-zinc-50 py-16 border-t border-zinc-100 mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <h2 className="text-2xl font-serif text-zinc-900 mb-8 text-center">Vous aimerez aussi</h2>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
