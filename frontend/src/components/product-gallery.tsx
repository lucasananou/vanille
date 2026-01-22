'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] w-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                Aucune image disponible
            </div>
        );
    }

    const handleNext = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image Container */}
            <div
                className="relative w-full aspect-[4/5] bg-zinc-50 overflow-hidden rounded-sm group cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
            >
                <img
                    src={getImageUrl(images[selectedImage])}
                    alt={`${title} - image ${selectedImage + 1}`}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Index Badge */}
                <div className="absolute bottom-4 left-4 bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                    {selectedImage + 1}/{images.length}
                </div>

                {/* Navigation Arrows (Desktop Hover) */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-zinc-900 border border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all pointer-events-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-zinc-900 border border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all pointer-events-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Thumbnails Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`aspect-[4/5] relative overflow-hidden bg-zinc-50 rounded-sm transition-all ${selectedImage === idx
                                ? 'ring-1 ring-zinc-900 ring-offset-1'
                                : 'hover:opacity-80'
                                }`}
                        >
                            <img
                                src={getImageUrl(image)}
                                alt={`${title} mini-${idx + 1}`}
                                className="absolute inset-0 h-full w-full object-cover object-center"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal (Lightbox) */}
            {isZoomed && (
                <div className="fixed inset-0 z-[150] bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end p-6 absolute top-0 right-0 z-10">
                        <button
                            onClick={() => setIsZoomed(false)}
                            className="p-2 text-zinc-900 hover:text-zinc-600 transition-colors bg-white/50 backdrop-blur rounded-full"
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 w-full h-full relative flex items-center justify-center bg-white">
                        <div className="relative w-full h-full max-w-5xl max-h-[90vh] p-4">
                            <img
                                src={getImageUrl(images[selectedImage])}
                                alt={`${title} zoomed`}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Navigation in zoom */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrev();
                                    }}
                                    className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 text-zinc-900 bg-white hover:bg-zinc-50 rounded-full shadow-lg transition-transform hover:scale-105"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNext();
                                    }}
                                    className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 text-zinc-900 bg-white hover:bg-zinc-50 rounded-full shadow-lg transition-transform hover:scale-105"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
