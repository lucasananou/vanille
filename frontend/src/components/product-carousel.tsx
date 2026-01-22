'use client';

import { useRef } from 'react';
import ProductCard from './product-card';
import { Product } from '@/lib/types';

interface ProductCarouselProps {
    products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200; // Adjust scroll amount as needed
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-xl font-bold mb-1">Complète le look</h3>
                    <p className="text-xs text-zinc-500 font-medium">Offre : -10% sur l'ensemble</p>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                        aria-label="Scroll left"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                        aria-label="Scroll right"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 snap-x scrollbar-hide"
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[140px] w-[45%] flex-shrink-0 snap-start">
                        <div className="border border-zinc-100/50 rounded-sm overflow-hidden">
                            <ProductCard product={product} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
