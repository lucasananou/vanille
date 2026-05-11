import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PolitiqueCookiesPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-zinc-900">
            <Header />
            <main className="mx-auto w-full max-w-4xl flex-grow px-6 py-12">
                <h1 className="mb-8 text-center text-3xl font-serif text-zinc-900">Politique de cookies</h1>

                <div className="prose prose-zinc max-w-none">
                    <p>
                        Cette page explique l’usage des cookies et technologies similaires sur le site <strong>M.S.V-NOSY BE</strong>.
                    </p>

                    <h2>1. Pourquoi des cookies peuvent être utilisés</h2>
                    <p>
                        Des cookies peuvent être déposés pour assurer le bon fonctionnement du site, mémoriser certaines préférences, mesurer la fréquentation et améliorer l’expérience utilisateur.
                    </p>

                    <h2>2. Types de cookies concernés</h2>
                    <ul>
                        <li>Cookies techniques nécessaires au fonctionnement du site.</li>
                        <li>Cookies de mesure d’audience ou d’analyse, si activés.</li>
                        <li>Cookies liés à des services tiers, comme les paiements ou certains contenus embarqués.</li>
                    </ul>

                    <h2>3. Gestion de vos préférences</h2>
                    <p>
                        Vous pouvez configurer votre navigateur pour bloquer ou supprimer les cookies. Certaines fonctionnalités du site peuvent alors être limitées.
                    </p>

                    <h2>4. Contact</h2>
                    <p>
                        Pour toute question sur l’usage des cookies ou de vos données, vous pouvez écrire à <a href="mailto:contact@vanille-nosybe.fr">contact@vanille-nosybe.fr</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
