'use client';

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api/products';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, Collection } from '@/lib/types';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import FilterSidebar from '@/components/filter-sidebar';


export default function CollectionPage() {
    const { slug } = useParams() as { slug: string };
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get params from URL or default
    const page = Number(searchParams.get('page')) || 1;
    const activeFilter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    const [products, setProducts] = useState<Product[]>([]);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Keep non-URL state for complex object filters (could be moved to URL too later)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // Pagination constants
    const take = 24;
    const skip = (page - 1) * take;
    const [total, setTotal] = useState(0);

    // Helper to update URL params
    const updateParams = (updates: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });

        const search = current.toString();
        const query = search ? `?${search}` : '';

        router.push(`${pathname}${query}`, { scroll: false });
    };

    const setActiveFilter = (val: string) => updateParams({ filter: val, page: '1' });

    useEffect(() => {
        const fetchCollectionData = async () => {
            setIsLoading(true);
            try {
                // Fetch collection details
                const collResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/store/collections/${slug}`);
                if (!collResponse.ok) throw new Error('Collection non trouvée');
                const collData = await collResponse.json();
                setCollection(collData);

                // Build query params based on active filter
                const queryParams: any = {
                    collection: slug,
                    skip,
                    take
                };

                // Fetch products for this collection
                const productsResponse = await productsApi.getProducts(queryParams);

                let fetchedProducts = productsResponse.data || [];

                // Client-side filtering (Mock logic for demo)
                if (activeFilter === 'stock' || inStockOnly) {
                    fetchedProducts = fetchedProducts.filter(p => p.stock > 0);
                } else if (activeFilter === 'under-50') {
                    fetchedProducts = fetchedProducts.filter(p => p.price < 5000);
                } else if (activeFilter === 'promo') {
                    fetchedProducts = fetchedProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price);
                }

                setProducts(fetchedProducts);
                setTotal(productsResponse.pagination?.total || 0);
            } catch (err) {
                console.error('Failed to fetch collection products:', err);
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchCollectionData();
        }
    }, [slug, page, activeFilter, inStockOnly, sort]); // Depend on URL params

    const QuickFilterButton = ({ id, label, icon }: { id: string, label: string, icon?: React.ReactNode }) => (
        <button
            onClick={() => {
                updateParams({ filter: id, page: '1' });
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${activeFilter === id
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900'
                }`}
        >
            {icon}
            {label}
        </button>
    );

    if (error) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                    <h2 className="text-2xl font-medium text-zinc-900 mb-4">Oups !</h2>
                    <p className="text-zinc-500 mb-8">{error}</p>
                    <Link href="/" className="bg-zinc-900 text-white px-8 py-3 text-sm font-medium transition-all hover:bg-zinc-800">
                        Retour à la boutique
                    </Link>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <Header />

            {/* Simple Hero */}
            <header className="bg-white py-16 text-center border-b border-zinc-50">
                <div className="mx-auto max-w-2xl px-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-6 capitalize">
                        {collection?.name || slug.replace(/-/g, ' ')}
                    </h1>
                    {collection?.description ? (
                        <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-light max-w-xl mx-auto">
                            {collection.description}
                        </p>
                    ) : (
                        <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-light max-w-xl mx-auto">
                            Élégance, modestie et confort. Découvrez notre sélection exclusive pour toutes les occasions.
                            Livraison express 2-3 jours, retours faciles & paiement 100% sécurisé.
                        </p>
                    )}
                </div>
            </header>

            {/* Filter Bar */}
            <div className="sticky top-20 z-40 w-full bg-white border-b border-zinc-100 shadow-sm">
                <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200 rounded"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>

                        <div className="h-6 w-px bg-zinc-200 mx-2 hidden md:block"></div>

                        <div className="hidden md:flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                            <QuickFilterButton id="all" label="Toute la boutique" />
                            <QuickFilterButton id="stock" label="En stock" icon={<span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>} />
                            <QuickFilterButton id="under-50" label="Moins de 50 €" icon={<span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>} />
                            <QuickFilterButton id="promo" label="Promos" icon={<span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Result Count - Only show on small screens */}
                        <span className="sm:hidden text-xs font-medium text-zinc-500">{total} produits</span>

                        <div className="hidden sm:flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">Tri :</span>
                            <select className="bg-transparent text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-none focus:ring-0 cursor-pointer py-2 pr-8 pl-0">
                                <option>Meilleures ventes</option>
                                <option>Prix croissant</option>
                                <option>Prix décroissant</option>
                                <option>Nouveautés</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Sidebar Component */}
            <FilterSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                totalProducts={total}
            />

            <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
                {/* Result Count */}
                <div className="mb-8 text-sm italic text-zinc-500 hidden sm:block">
                    Affichage de <span className="font-semibold text-zinc-900">{total}</span> pépites tsniout
                </div>

                {/* Loader */}
                {isLoading && (
                    <div className="flex justify-center py-24">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && products.length === 0 && (
                    <div className="text-center py-24 bg-zinc-50/50 rounded-lg">
                        <p className="text-zinc-500 mb-6 font-light italic text-xl">&quot;Aucun produit ne correspond à vos filtres.&quot;</p>
                        <button onClick={() => updateParams({ filter: 'all', page: '1' })} className="text-sm font-medium border-b border-zinc-900 pb-0.5 hover:text-amber-700 hover:border-amber-700 transition-all">
                            Effacer les filtres
                        </button>
                    </div>
                )}

                {/* Product Grid - 2 columns on mobile */}
                {!isLoading && products.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > take && (
                            <div className="mt-20 flex justify-center border-t border-zinc-100 pt-10">
                                <div className="flex items-center gap-8">
                                    <Link
                                        href={{ query: { ...Object.fromEntries(searchParams.entries()), page: page - 1 } }}
                                        className={`text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors ${page <= 1 ? 'pointer-events-none opacity-20' : ''}`}
                                        aria-disabled={page <= 1}
                                    >
                                        Précédent
                                    </Link>
                                    <span className="text-xs font-medium text-zinc-400">
                                        {page} / {Math.ceil(total / take)}
                                    </span>
                                    <Link
                                        href={{ query: { ...Object.fromEntries(searchParams.entries()), page: page + 1 } }}
                                        className={`text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors ${page >= Math.ceil(total / take) ? 'pointer-events-none opacity-20' : ''}`}
                                        aria-disabled={page >= Math.ceil(total / take)}
                                    >
                                        Suivant
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* SEO Text Block for 'Robe' Collection */}
                {slug.toLowerCase().includes('robe') && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Robe tsniout</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Bienvenue chez Tsniout Shop, votre destination de confiance pour des <strong className="font-bold text-zinc-900">robes tsniout</strong> qui allient modestie et élégance. Nous croyons fermement que s’habiller avec discrétion peut être synonyme de style et de beauté. C’est pourquoi nous avons soigneusement sélectionné une collection de robes tsniout qui incarnent pudeur, raffinement, et confort.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Pourquoi choisir une robe tsniout ?</h3>
                                <p className="leading-relaxed">
                                    Les <strong className="font-bold text-zinc-900">robes tsniout</strong> sont bien plus qu’un simple vêtement. Elles reflètent un engagement envers des valeurs de modestie et de respect, tout en permettant de rester à la pointe de la mode. Nos robes sont conçues pour offrir une couverture complète, garantissant une apparence élégante et soignée en toutes circonstances. Que vous recherchiez une robe pour un événement spécial, une journée de travail, ou une sortie décontractée, vous trouverez chez nous la robe parfaite pour chaque occasion.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Une large gamme de styles pour tous les goûts</h3>
                                <p className="leading-relaxed">
                                    Chez Tsniout Shop, nous vous proposons une variété de <strong className="font-bold text-zinc-900">robes tsniout</strong> pour répondre à toutes vos envies. Découvrez nos robes longues fluides parfaites pour les journées chaudes, ou choisissez une robe plissée pour un look plus sophistiqué. Si vous aimez les motifs, nos robes imprimées ajouteront une touche de dynamisme à votre garde-robe, tandis que nos robes unies offrent une élégance intemporelle. Pour les occasions spéciales, explorez nos robes à volants ou robes en dentelle qui apportent une touche de romantisme et de luxe à votre style.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Qualité et confort au rendez-vous</h3>
                                <p className="leading-relaxed">
                                    Chaque <strong className="font-bold text-zinc-900">robe tsniout</strong> de notre collection est confectionnée à partir de matériaux de haute qualité, garantissant non seulement une esthétique impeccable mais aussi un confort optimal tout au long de la journée. Nos tissus, qu’ils soient en coton, en lin, ou en mousseline, sont soigneusement sélectionnés pour leur douceur et leur respirabilité, vous assurant une expérience de port agréable et durable.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Comment styliser votre robe tsniout ?</h3>
                                <p className="leading-relaxed">
                                    Une <strong className="font-bold text-zinc-900">robe tsniout</strong> de Tsniout Shop peut être stylisée de nombreuses façons. Associez-la à une veste en coton ou à un cardigan léger pour les journées plus fraîches, ou complétez-la avec des accessoires discrets pour un look raffiné. Que vous préfériez un style classique ou moderne, notre collection de robes tsniout vous offre d’innombrables possibilités pour exprimer votre personnalité tout en respectant vos valeurs de modestie.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Achetez votre robe tsniout chez Tsniout Shop</h3>
                                <p className="leading-relaxed m-0">
                                    En choisissant une <strong className="font-bold text-zinc-900">robe tsniout</strong> chez Tsniout Shop, vous faites le choix de la qualité, du style, et du respect des principes de modestie qui vous sont chers. Explorez notre collection dès maintenant et trouvez la robe parfaite qui vous accompagnera avec grâce et pudeur.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Text Block for 'Jupe' Collection */}
                {slug.toLowerCase().includes('jupe') && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Jupe tsniout</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Bienvenue sur notre page dédiée aux <strong className="font-bold text-zinc-900">jupes tsniout</strong>, où la modestie rencontre l’élégance. Chez Tsniout Shop, nous comprenons l’importance de s’habiller avec discrétion tout en exprimant son style personnel. C’est pourquoi nous avons sélectionné une vaste gamme de jupes tsniout qui allient pudeur, confort, et raffinement.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Pourquoi choisir une jupe tsniout ?</h3>
                                <p className="leading-relaxed">
                                    Les <strong className="font-bold text-zinc-900">jupes tsniout</strong> sont bien plus qu’un simple vêtement. Elles reflètent un engagement envers des valeurs de modestie et de respect, tout en permettant de rester à la pointe de la mode. Nos jupes sont conçues pour offrir une couverture complète, garantissant une apparence élégante et soignée en toutes circonstances. Que vous recherchiez une jupe pour un événement spécial, une journée de travail, ou une sortie décontractée, vous trouverez chez nous la jupe parfaite pour chaque occasion.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Un large choix de styles et de matières</h3>
                                <p className="leading-relaxed">
                                    Nous proposons une variété de styles pour répondre à tous les goûts et besoins. Découvrez nos <strong className="font-bold text-zinc-900">jupes longues fluides</strong>, idéales pour les journées chaudes, ou nos jupes plissées qui ajoutent une touche de sophistication à votre tenue. Si vous préférez un look plus décontracté, nos jupes en coton sont parfaites pour un confort au quotidien. Nous offrons également des jupes à motifs pour celles qui aiment ajouter une touche de fantaisie à leur garde-robe, ainsi que des jupes à volants pour un style plus romantique.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Qualité et confort avant tout</h3>
                                <p className="leading-relaxed">
                                    Chaque <strong className="font-bold text-zinc-900">jupe tsniout</strong> de notre collection est fabriquée avec des matériaux de haute qualité, garantissant non seulement une esthétique impeccable mais aussi un confort optimal tout au long de la journée. Le choix des tissus est essentiel pour nous : du coton doux au lin respirant, en passant par la mousseline légère, nous sélectionnons les meilleures matières pour que chaque jupe soit agréable à porter.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Comment porter votre jupe tsniout ?</h3>
                                <p className="leading-relaxed">
                                    Une <strong className="font-bold text-zinc-900">jupe tsniout</strong> se marie parfaitement avec un chemisier à manches longues, un cardigan élégant ou une veste en coton pour un look harmonieux et modeste. N’hésitez pas à jouer avec les accessoires pour personnaliser votre tenue tout en respectant les codes de la modestie. Que vous préfériez un style classique ou plus moderne, notre collection vous offre des possibilités infinies pour composer des tenues qui reflètent votre personnalité.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Achetez votre jupe tsniout chez nous !</h3>
                                <p className="leading-relaxed m-0">
                                    En choisissant une <strong className="font-bold text-zinc-900">jupe tsniout</strong> chez Tsniout Shop, vous faites le choix de la qualité, du style, et du respect des valeurs qui vous sont chères. Explorez notre collection dès maintenant et trouvez la jupe qui vous accompagnera avec élégance et modestie.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Text Block for 'Chemisier' Collection */}
                {(slug.toLowerCase().includes('chemisier') || slug.toLowerCase().includes('haut')) && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Chemisiers tsniout</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Bienvenue dans notre collection de <strong className="font-bold text-zinc-900">chemisiers tsniout</strong>, l'élément indispensable pour une garde-robe à la fois modeste et professionnelle. Chez Tsniout Shop, nous croyons que chaque détail compte. Nos chemisiers et blouses sont pensés pour offrir une élégance sans effort tout en respectant scrupuleusement les codes de la pudeur.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">L'alliance du style et de la pudeur</h3>
                                <p className="leading-relaxed">
                                    Le <strong className="font-bold text-zinc-900">chemisier tsniout</strong> est une pièce maîtresse qui se doit d'être impeccable. Nos modèles sont conçus avec des encolures montantes et des manches longues ou trois-quarts, garantissant une couvrance optimale sans jamais compromettre votre style. Que ce soit pour le bureau, une sortie ou une occasion particulière, nos hauts vous assurent une allure raffinée et soignée.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Des matières nobles pour un confort durable</h3>
                                <p className="leading-relaxed">
                                    La qualité est au cœur de notre démarche. Nous sélectionnons des tissus comme la soie, le coton premium et le lin pour leur tombé fluide et leur douceur. Nos <strong className="font-bold text-zinc-900">chemisiers tsniout</strong> sont non seulement beaux à regarder, mais aussi extrêmement confortables à porter tout au long de la journée, laissant votre peau respirer avec légèreté.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Comment accorder votre chemisier ?</h3>
                                <p className="leading-relaxed">
                                    Associez l'un de nos chemisiers fluides avec une jupe longue pour un look classique, ou glissez-le sous une veste cintrée pour une silhouette plus structurée. Nos modèles unis offrent une élégance intemporelle, tandis que nos blouses à motifs apportent une touche de caractère et de modernité à votre ensemble.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Votre destination mode tsniout</h3>
                                <p className="leading-relaxed m-0">
                                    En choisissant vos hauts chez Tsniout Shop, vous optez pour des pièces qui durent et qui respectent vos valeurs. Parcourez notre sélection et trouvez le <strong className="font-bold text-zinc-900">chemisier parfait</strong> qui sublimera votre quotidien avec grâce et élégance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Text Block for 'Veste' Collection */}
                {slug.toLowerCase().includes('veste') && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Vestes & Blazers tsniout</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Découvrez notre gamme de <strong className="font-bold text-zinc-900">vestes tsniout</strong>, conçues pour compléter vos tenues avec élégance et pudeur. Chez Tsniout Shop, la veste n'est pas qu'un accessoire, c'est la pièce finale qui structure votre silhouette tout en respectant vos valeurs.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Une finition élégante et couvrante</h3>
                                <p className="leading-relaxed">
                                    Nos vestes et blazers sont coupés pour offrir une aisance parfaite et une longueur adaptée, assurant une couverture idéale des hanches et du dos. Que vous cherchiez un blazer structuré pour le travail ou une veste plus décontractée pour le week-end, notre sélection allie modernité et respect des codes de la modestie.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Des styles variés pour chaque saison</h3>
                                <p className="leading-relaxed">
                                    Du tweed classique au lin léger pour l'été, en passant par des lainages confortables pour l'hiver, nous avons une veste pour chaque saison. Chaque pièce est pensée pour se superposer harmonieusement avec nos jupes et chemisiers, créant des ensembles cohérents et raffinés.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Qualité et durabilité</h3>
                                <p className="leading-relaxed">
                                    Investir dans une <strong className="font-bold text-zinc-900">veste Tsniout Shop</strong>, c'est choisir un vêtement durable, aux finitions soignées. Nous privilégions des coupes intemporelles qui traversent les tendances, vous garantissant une pièce maîtresse que vous garderez des années.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Complétez votre look</h3>
                                <p className="leading-relaxed m-0">
                                    La veste parfaite vous attend. Parcourez notre collection et trouvez celle qui apportera la touche finale de sophistication à votre garde-robe tsniout.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Text Block for 'Pull' Collection */}
                {slug.toLowerCase().includes('pull') && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Pulls & Mailles tsniout</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Enveloppez-vous de douceur avec notre collection de <strong className="font-bold text-zinc-900">pulls tsniout</strong>. Chez Tsniout Shop, le confort ne se fait jamais au détriment de l'élégance ou de la pudeur. Nos mailles sont pensées pour vous tenir chaud tout en restant sophistiquée.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Confort, chaleur et modestie</h3>
                                <p className="leading-relaxed">
                                    Nos pulls sont conçus avec des coupes amples et des encolures respectueuses, pour un port quotidien en toute sérénité. Fini les pulls trop courts ou trop ajustés ; nos modèles tombent parfaitement pour assurer une allure gracieuse et couvrante en toutes circonstances.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Des mailles d'exception</h3>
                                <p className="leading-relaxed">
                                    Laine mérinos, cachemire mélangé, ou coton épais : nous choisissons des matières nobles qui ne grattent pas et résistent au temps. <strong className="font-bold text-zinc-900">Nos pulls tsniout</strong> sont une caresse sur la peau, idéals pour affronter les saisons fraîches avec style.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Le mariage parfait avec vos jupes</h3>
                                <p className="leading-relaxed">
                                    Rien n'est plus chic qu'un beau pull associé à une jupe longue ou mi-longue. Nos designs sont pensés pour cette harmonie, avec des longueurs qui équilibrent la silhouette sans l'alourdir. Osez les couleurs douces ou les teintes classiques pour varier vos looks.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Trouvez votre maille favorite</h3>
                                <p className="leading-relaxed m-0">
                                    Explorez notre sélection de pulls et cardigans et découvrez le plaisir d'une maille de qualité, pensée pour la femme tsniout moderne.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Text Block for 'Bijou' Collection */}
                {slug.toLowerCase().includes('bijou') && (
                    <div className="mt-24 pt-16 border-t border-zinc-100 max-w-4xl mx-auto text-zinc-600">
                        <h2 className="text-3xl font-serif text-zinc-900 mb-8">Bijoux & Accessoires</h2>
                        <div className="prose prose-zinc prose-sm max-w-none space-y-8">
                            <p className="leading-relaxed">
                                Sublimez votre tenue avec notre sélection de <strong className="font-bold text-zinc-900">bijoux élégants</strong>. Chez Tsniout Shop, nous savons que la modestie réside aussi dans les détails. Nos accessoires sont choisis pour apporter une touche de lumière et de féminité, sans ostentation.
                            </p>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">L'art du détail raffiné</h3>
                                <p className="leading-relaxed">
                                    Un collier fin, une paire de boucles d'oreilles délicates ou un bracelet discret peuvent transformer une tenue simple en une allure sophistiquée. Nos bijoux sont sélectionnés pour leur finesse et leur capacité à rehausser votre beauté naturelle avec subtilité.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Qualité et intemporalité</h3>
                                <p className="leading-relaxed">
                                    Nous privilégions des matériaux durables, dorés à l'or fin ou en argent, pour des bijoux qui gardent leur éclat. <strong className="font-bold text-zinc-900">Nos créations</strong> sont pensées pour être portées au quotidien comme pour les grandes occasions, traversant les modes avec élégance.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">L'idée cadeau idéale</h3>
                                <p className="leading-relaxed">
                                    À la recherche d'un cadeau attentionné ? Nos bijoux sont emballés avec soin, prêts à offrir. C'est le petit plus qui fait toute la différence et qui complète à merveille une garde-robe tsniout bien pensée.
                                </p>
                            </div>

                            <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100 mt-8">
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">Apportez la touche finale</h3>
                                <p className="leading-relaxed m-0">
                                    Laissez-vous séduire par notre collection et trouvez le bijou qui fera scintiller votre quotidien avec douceur et distinction.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
