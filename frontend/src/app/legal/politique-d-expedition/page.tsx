
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PolitiqueExpedition() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Politique d&apos;Expédition</h1>

                <div className="prose prose-zinc max-w-none">
                    <h2>1. Zones de livraison</h2>
                    <p>
                        Nous expédions actuellement vers la France Métropolitaine, la Belgique, la Suisse, le Canada, les États-Unis et Israël.
                    </p>

                    <h2>2. Frais d&apos;expédition</h2>
                    <p>
                        Les frais d&apos;expédition sont calculés au passage à la caisse selon la destination de livraison et le mode d&apos;expédition disponible pour votre commande.
                    </p>
                    <ul className="list-disc pl-5">
                        <li><strong>France Métropolitaine :</strong> plusieurs modes de livraison sont proposés au checkout selon la commande, avec livraison offerte disponible à partir d&apos;un certain montant lorsque l&apos;offre s&apos;applique.</li>
                        <li><strong>États-Unis :</strong> Colissimo International à partir de 28,90€ avant promotions ponctuelles affichées au checkout.</li>
                        <li><strong>Autres destinations internationales :</strong> tarif communiqué au checkout lorsqu&apos;un mode est disponible.</li>
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
