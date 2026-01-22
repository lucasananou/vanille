'use client';

import { useState, useRef } from 'react';
import { adminUploadApi } from '@/lib/api/admin-upload';
import { useAdminAuth } from '@/lib/admin-auth-context';

interface ImageManagerProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageManager({ images, onChange }: ImageManagerProps) {
    const { token } = useAdminAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        // Handle local paths
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        // Ensure url starts with / if not present
        const path = url.startsWith('/') ? url : `/${url}`;
        return `${baseUrl}${path}`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !token) return;

        setIsUploading(true);
        try {
            const files = Array.from(e.target.files);
            // We use uploadImages for bulk support
            const results = await adminUploadApi.uploadImages(files, token);

            // Assume results is array of { url: string, ... }
            // If backend returns a single object for array upload?
            // upload.service.ts returns an array of objects for uploadMultipleImages.
            const newUrls = Array.isArray(results)
                ? results.map((r: any) => r.url)
                : [results.url];

            onChange([...images, ...newUrls]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Échec de l\'upload');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative group aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getImageUrl(url)}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition text-sm font-medium disabled:opacity-50"
                >
                    {isUploading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Ajouter des images
                        </>
                    )}
                </button>
                <p className="text-xs text-zinc-500">
                    JPG, PNG, WebP acceptés. Max 5MB.
                </p>
            </div>
        </div>
    );
}
