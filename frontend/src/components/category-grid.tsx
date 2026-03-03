'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoryGrid() {
    const categories = [
        {
            title: "Vanille Gourmet",
            href: "/shop",
            image: "/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8394.jpg",
            description: "Gousses souples et parfumées"
        },
        {
            title: "Vanille Prestige",
            href: "/shop",
            image: "/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8403.jpg",
            description: "Le format premium de 18cm"
        },
        {
            title: "Poivre Sauvage",
            href: "/produit/poivre-sauvage",
            image: "/photos-produit-vanille/poivre-sauvage-madagascar.jpg",
            description: "L'or noir de Madagascar"
        }
    ];

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <h2 className="sr-only">Nos Catégories</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        href={category.href}
                        className="group relative block h-[300px] w-full overflow-hidden bg-zinc-100"
                    >
                        <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#a1b8ff] opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                Découvrir
                            </span>
                            <h3 className="text-2xl font-serif text-white mb-2">
                                {category.title}
                            </h3>
                            <p className="text-sm font-light text-zinc-100 opacity-90">
                                {category.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
