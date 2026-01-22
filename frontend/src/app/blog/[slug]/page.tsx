
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/data/blog-posts';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return {
            title: 'Article non trouvé | Tsniout Shop',
        };
    }

    return {
        title: `${post.title} | Blog Tsniout Shop`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://tsniout-shop.fr/blog/${slug}`,
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    // Related posts logic (simple: take 3 other posts)
    const relatedPosts = BLOG_POSTS
        .filter(p => p.slug !== slug)
        .slice(0, 3);

    return (
        <div className="bg-white min-h-screen text-zinc-900 font-sans">
            <Header />

            <main className="pt-8 pb-16">
                {/* Article Header */}
                <header className="max-w-3xl mx-auto px-6 text-center mb-12">
                    <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#a1b8ff] mb-6">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                        <span>{post.readTime} de lecture</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif text-zinc-900 leading-tight mb-6">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 italic">
                        <span>Par {post.author}</span>
                        <span>•</span>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </time>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="max-w-5xl mx-auto px-6 mb-12">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <article className="max-w-2xl mx-auto px-6 prose prose-zinc prose-lg hover:prose-a:text-[#a1b8ff] prose-a:transition-colors">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Author Bio / Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BlogPosting',
                            headline: post.title,
                            image: post.coverImage,
                            datePublished: post.date,
                            author: {
                                '@type': 'Person',
                                name: post.author
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'Tsniout Shop',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://tsniout-shop.fr/logo.png' // Ensure this exists or use a valid URL
                                }
                            },
                            description: post.excerpt
                        })
                    }}
                />

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="bg-zinc-50 mt-24 py-16 border-t border-zinc-100">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-2xl font-serif text-zinc-900 mb-8 text-center">Vous aimerez aussi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((related) => (
                                    <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                                        <div className="relative aspect-[3/2] overflow-hidden rounded-sm mb-4 bg-zinc-200">
                                            <img
                                                src={related.coverImage}
                                                alt={related.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-lg font-medium text-zinc-900 group-hover:text-[#a1b8ff] transition-colors mb-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
