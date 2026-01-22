import { productsApi } from '@/lib/api/products';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import FeaturesBar from '@/components/features-bar';
import CategoryGrid from '@/components/category-grid';
import TestimonialsSection from '@/components/testimonials-section';

export default async function Home() {
  // Fetch products from backend
  let products: Product[] = [];
  let error: string | null = null;

  try {
    const response = await productsApi.getProducts({ limit: 6, page: 1, collection: 'robe-tsniout' });
    products = response.data || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error = err instanceof Error ? err.message : 'Impossible de charger les produits';
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-white py-2 text-center">
        <p className="text-[10px] uppercase tracking-widest font-medium">Livraison offerte dès 100€ d'achat</p>
      </div>

      <Header />

      {/* Hero Section */}
      <header className="relative w-full bg-zinc-50 overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 md:py-24 lg:px-12">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">Nouvelle Collection</span>
            <h1 className="mb-6 text-5xl font-serif tracking-tight text-zinc-900 lg:text-6xl">
              L'Élégance de la <br /> <span className="italic text-[#a1b8ff]">Modestie</span>
            </h1>
            <p className="mb-8 max-w-md text-base text-zinc-600 leading-relaxed font-light">
              Découvrez notre sélection de vêtements tsniout, alliant raffinement et pudeur. Des coupes fluides, des matières nobles et un style intemporel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/robe-tsniout" className="inline-flex items-center gap-2 bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#a1b8ff]">
                Découvrir les Robes
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/jupe-longue-tsniout" className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-zinc-900 transition-all hover:border-zinc-300">
                Voir les Jupes
              </Link>
            </div>
          </div>
          <div className="relative h-96 w-full bg-zinc-200 md:h-auto">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop"
              alt="Femme élégante en robe tsniout"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </header>

      <FeaturesBar />

      {/* Main Content */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 py-12">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-zinc-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-serif text-zinc-900">Nos Robes Coups de Cœur</h2>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select className="appearance-none rounded-none border-b border-zinc-200 bg-transparent py-2 pl-2 pr-8 text-sm font-medium text-zinc-600 focus:border-zinc-900 focus:outline-none cursor-pointer">
                <option>Trier par : Nouveautés</option>
                <option>Prix : Croissant</option>
                <option>Prix : Décroissant</option>
              </select>
              <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
              <p className="font-medium">Erreur lors du chargement des produits</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!error && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500">Aucun produit trouvé.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-16 border-t border-zinc-100 pt-10 text-center">
              <Link href="/produit" className="inline-flex h-10 px-8 items-center justify-center border border-zinc-900 bg-white text-xs font-semibold uppercase tracking-widest text-zinc-900 transition hover:bg-zinc-900 hover:text-white">
                Voir toute la collection
              </Link>
            </div>
          )}
        </div>

        <div className="my-16">
          <CategoryGrid />
        </div>
      </main>

      <TestimonialsSection />

      {/* Our Story Section */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-24 lg:items-center">
          <div className="relative h-[500px] w-full overflow-hidden">
            <Image
              src="/story-image.png"
              alt="Mère et fille travaillant dans l'atelier"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">Notre Histoire</span>
            <h2 className="mb-6 text-4xl font-serif text-zinc-900">
              Plus qu'une Marque,<br /> <span className="italic text-[#a1b8ff]">Un Héritage.</span>
            </h2>
            <div className="space-y-6 text-zinc-600 font-light leading-relaxed">
              <p>
                Chez Tsniout, chaque pièce raconte une histoire de transmission. C'est dans notre atelier familial, entre les mains expertes d'une mère et le regard moderne de sa fille, que naissent nos collections.
              </p>
              <p>
                Nous croyons que la modestie n'est pas une contrainte, mais l'expression ultime de l'élégance. Chaque tissu est choisi avec amour, chaque coupe est pensée pour sublimer la femme tout en respectant ses valeurs.
              </p>
              <p>
                Porter Tsniout, c'est rejoindre une lignée de femmes qui ne font aucun compromis entre leur foi et leur style.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/about" className="text-sm font-medium uppercase tracking-widest text-[#a1b8ff] hover:text-[#8da0ef] transition-colors">
                En savoir plus sur l'atelier →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-zinc-900 py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <span className="mb-4 block text-3xl font-light italic text-[#a1b8ff] font-serif">"La beauté de l'intérieur"</span>
          <h2 className="text-2xl font-medium tracking-tight">Rejoignez la communauté Tsniout</h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400 font-light">
            Inscrivez-vous pour recevoir nos conseils de style, nos nouveautés et des offres exclusives réservées à nos membres.
          </p>
          <form className="mx-auto mt-8 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="w-full border-b border-zinc-700 bg-transparent py-2 text-sm text-white placeholder-zinc-500 focus:border-[#a1b8ff] focus:outline-none"
            />
            <button type="submit" className="text-xs font-semibold uppercase tracking-widest text-white hover:text-[#a1b8ff]">
              S'inscrire
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
