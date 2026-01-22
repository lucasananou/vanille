
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function PolitiqueConfidentialite() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Politique de Confidentialité</h1>

                <div className="prose prose-zinc max-w-none">
                    <p>
                        Chez <strong>Tsniout Shop</strong>, nous accordons une grande importance à la confidentialité de vos données. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations personnelles.
                    </p>

                    <h2>1. Collecte des données</h2>
                    <p>
                        Nous collectons les informations que vous nous fournissez lors de :
                    </p>
                    <ul className="list-disc pl-5">
                        <li>La création de votre compte client.</li>
                        <li>Le passage d'une commande.</li>
                        <li>L'inscription à notre newsletter.</li>
                    </ul>
                    <p>
                        Les données collectées incluent : nom, prénom, adresse, email, numéro de téléphone.
                    </p>

                    <h2>2. Utilisation des données</h2>
                    <p>
                        Vos données sont utilisées pour :
                    </p>
                    <ul className="list-disc pl-5">
                        <li>Traiter et livrer vos commandes.</li>
                        <li>Gérer votre compte client et le service après-vente.</li>
                        <li>Vous envoyer des offres promotionnelles (si vous y avez consenti).</li>
                    </ul>

                    <h2>3. Partage des données</h2>
                    <p>
                        Nous ne vendons jamais vos données personnelles. Elles peuvent être partagées avec des prestataires tiers uniquement pour l'exécution des services (transporteurs, processeurs de paiement).
                    </p>

                    <h2>4. Vos droits</h2>
                    <p>
                        Vous disposez d'un droit d'accès, de modification et de suppression de vos données. Pour l'exercer, contactez-nous à <a href="mailto:contact@tsniout-shop.fr">contact@tsniout-shop.fr</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
