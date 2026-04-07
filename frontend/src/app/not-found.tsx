import Link from 'next/link';
import { headers } from 'next/headers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { normalizeLocale, withLocale } from '@/lib/i18n';

export default async function NotFound() {
    const locale = normalizeLocale((await headers()).get('x-locale'));

    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-24">
                <div className="max-w-lg mx-auto">
                    <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4 block">
                        Error 404
                    </span>

                    <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 mb-6">
                        {locale === 'en' ? 'Sorry, this page could not be found.' : 'Oups, cette page est introuvable.'}
                    </h1>

                    <p className="text-zinc-500 mb-10 text-lg font-light leading-relaxed">
                        {locale === 'en'
                            ? 'The link you followed may be broken, or the page may have been moved. You can return home or continue exploring the collection.'
                            : 'Il semblerait que le lien que vous avez suivi soit cassé ou que la page ait été supprimée. Ne vous inquiétez pas, vous pouvez retourner à l\'accueil ou explorer nos collections.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={withLocale('/', locale)}
                            className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white font-medium text-sm transition-all hover:bg-zinc-800 hover:shadow-lg"
                        >
                            {locale === 'en' ? 'Back to home' : "Retour à l'accueil"}
                        </Link>

                        <Link
                            href={withLocale('/shop', locale)}
                            className="w-full sm:w-auto px-8 py-3 bg-white border border-zinc-200 text-zinc-900 font-medium text-sm transition-all hover:border-zinc-900"
                        >
                            {locale === 'en' ? 'Shop' : 'Boutique'}
                        </Link>
                    </div>

                    <div className="mt-16 pt-16 border-t border-zinc-100 w-full">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-8">
                            {locale === 'en' ? 'Explore our selection' : 'Explorer notre sélection'}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: locale === 'en' ? 'Prestige Vanilla' : 'Vanille Prestige', href: withLocale('/shop', locale) },
                                { name: locale === 'en' ? 'Gourmet Vanilla' : 'Vanille Gourmet', href: withLocale('/shop', locale) },
                                { name: locale === 'en' ? 'Wild Pepper' : 'Poivre Sauvage', href: withLocale('/produit/poivre-sauvage', locale) },
                                { name: locale === 'en' ? 'Journal' : 'Le Blog', href: withLocale('/blog', locale) },
                            ].map((cat) => (
                                <Link
                                    key={cat.name}
                                    href={cat.href}
                                    className="block p-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-sm font-medium text-zinc-700 hover:text-zinc-900"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
