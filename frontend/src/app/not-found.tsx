import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-24">
                <div className="max-w-lg mx-auto">
                    <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4 block">
                        Erreur 404
                    </span>

                    <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 mb-6">
                        Oups, cette page est introuvable.
                    </h1>

                    <p className="text-zinc-500 mb-10 text-lg font-light leading-relaxed">
                        Il semblerait que le lien que vous avez suivi soit cassé ou que la page ait été supprimée.
                        Ne vous inquiétez pas, vous pouvez retourner à l'accueil ou explorer nos collections.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-3 bg-zinc-900 text-white font-medium text-sm transition-all hover:bg-zinc-800 hover:shadow-lg"
                        >
                            Retour à l'accueil
                        </Link>

                        <Link
                            href="/new"
                            className="w-full sm:w-auto px-8 py-3 bg-white border border-zinc-200 text-zinc-900 font-medium text-sm transition-all hover:border-zinc-900"
                        >
                            Voir les nouveautés
                        </Link>
                    </div>

                    <div className="mt-16 pt-16 border-t border-zinc-100 w-full">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-8">
                            Nos catégories populaires
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: 'Robes', href: '/robe-tsniout' },
                                { name: 'Jupes', href: '/jupe-longue-tsniout' },
                                { name: 'Hauts', href: '/chemisier' },
                                { name: 'Accessoires', href: '/collier' },
                            ].map((cat) => (
                                <Link
                                    key={cat.href}
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
