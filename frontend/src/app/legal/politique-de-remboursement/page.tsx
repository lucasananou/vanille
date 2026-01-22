
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PolitiqueRemboursement() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Politique de Remboursement et de Retour</h1>

                <div className="prose prose-zinc max-w-none">
                    <h2>1. Délai de retour</h2>
                    <p>
                        Nous avons une politique de retour de <strong>14 jours</strong>. Vous avez 14 jours après la réception de votre article pour demander un retour.
                    </p>
                    <p>
                        Pour être éligible à un retour, votre article doit être dans le même état que celui dans lequel vous l'avez reçu, non porté et non utilisé, avec les étiquettes, et dans son emballage d'origine.
                    </p>

                    <h2>2. Comment effectuer un retour ?</h2>
                    <p>
                        Pour lancer un retour, vous pouvez nous contacter à <a href="mailto:contact@tsniout-shop.fr">contact@tsniout-shop.fr</a>. Si votre retour est accepté, nous vous enverrons les instructions sur comment et où envoyer votre colis. Les articles renvoyés sans demande préalable ne seront pas acceptés.
                    </p>

                    <h2>3. Remboursements</h2>
                    <p>
                        Nous vous informerons une fois que nous aurons reçu et inspecté votre retour. Si le remboursement est approuvé, vous serez automatiquement remboursé sur votre mode de paiement d'origine. Veuillez noter que cela peut prendre un certain temps avant que votre banque ou votre société de carte de crédit ne traite et n'affiche le remboursement.
                    </p>

                    <h2>4. Échanges</h2>
                    <p>
                        Le moyen le plus rapide de s'assurer d'obtenir ce que vous voulez est de retourner l'article que vous avez, et une fois le retour accepté, d'effectuer un achat séparé pour le nouvel article.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
