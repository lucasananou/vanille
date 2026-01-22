
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PolitiqueExpedition() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Politique d'Expédition</h1>

                <div className="prose prose-zinc max-w-none">
                    <h2>1. Zones de livraison</h2>
                    <p>
                        Nous expédions actuellement vers la France Métropolitaine, la Belgique, la Suisse, le Canada, les États-Unis et Israël.
                    </p>

                    <h2>2. Frais d'expédition</h2>
                    <p>
                        Les frais d'expédition sont calculés lors du passage à la caisse en fonction du poids, des dimensions et de la destination des articles commandés.
                    </p>
                    <ul className="list-disc pl-5">
                        <li><strong>France Métropolitaine :</strong> Livraison standard à 5,90€. Gratuite dès 100€ d'achat.</li>
                        <li><strong>International :</strong> Livraison à partir de 12,00€.</li>
                    </ul>

                    <h2>3. Délais de traitement</h2>
                    <p>
                        Toutes les commandes sont traitées dans un délai de 1 à 2 jours ouvrables (hors week-ends et jours fériés) après réception de votre e-mail de confirmation de commande. Vous recevrez une autre notification lorsque votre commande aura été expédiée.
                    </p>

                    <h2>4. Suivi de commande</h2>
                    <p>
                        Lorsque votre commande sera expédiée, vous recevrez une notification par e-mail de notre part qui inclura un numéro de suivi que vous pourrez utiliser pour vérifier son statut. Veuillez prévoir 48 heures pour que les informations de suivi soient disponibles.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
