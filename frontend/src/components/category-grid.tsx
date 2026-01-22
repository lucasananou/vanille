'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CategoryGrid() {
    const categories = [
        {
            title: "Les Robes",
            href: "/robe-tsniout",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2583&auto=format&fit=crop",
            description: "Élégance & pudeur au quotidien"
        },
        {
            title: "Les Jupes",
            href: "/jupe-longue-tsniout",
            image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=2664&auto=format&fit=crop",
            description: "Coupes fluides et intemporelles"
        },
        {
            title: "Nouveautés",
            href: "/new",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop",
            description: "Les dernières pièces de l'atelier"
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
