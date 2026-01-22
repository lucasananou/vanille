import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { BLOG_POSTS } from '@/lib/data/blog-posts';

export default function BlogPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-7xl w-full px-6 py-12">
                <div className="text-center mb-16">
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">Blog</span>
                    <h1 className="text-4xl font-serif text-zinc-900">Inspirations & Conseils</h1>
                    <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
                        Découvrez nos articles sur la mode tsniout, nos conseils de style et les coulisses de notre atelier.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.slug} className="group flex flex-col">
                            <Link href={`/${post.slug}`} className="relative h-64 w-full overflow-hidden rounded-lg bg-zinc-100 mb-6">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </Link>
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500 mb-3">
                                    <span>{post.category}</span>
                                    <span>•</span>
                                    <span>{post.readTime} de lecture</span>
                                </div>
                                <h2 className="text-xl font-medium text-zinc-900 mb-3 group-hover:text-[#a1b8ff] transition-colors">
                                    <Link href={`/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-zinc-600 font-light mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link href={`/${post.slug}`} className="mt-auto inline-flex items-center text-sm font-medium text-[#a1b8ff] hover:text-[#8da0ef]">
                                    Lire l'article →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
