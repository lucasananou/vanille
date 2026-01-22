
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function MentionsLegales() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Mentions Légales</h1>

                <div className="prose prose-zinc max-w-none">
                    <h2>1. Éditeur du site</h2>
                    <p>
                        Le site <strong>Tsniout Shop</strong> (ci-après dénommé « le Site ») est édité par :<br />
                        <strong>Tsniout Shop LTD</strong><br />
                        Adresse : 123 Rue de la Modestie, 75000 Paris, France<br />
                        Email : <a href="mailto:contact@tsniout-shop.fr">contact@tsniout-shop.fr</a><br />
                        Téléphone : +33 1 23 45 67 89<br />
                        Numéro SIRET : 123 456 789 00012<br />
                        Directeur de la publication : Sarah Cohen
                    </p>

                    <h2>2. Hébergement</h2>
                    <p>
                        Le site est hébergé par :<br />
                        <strong>Vercel Inc.</strong><br />
                        340 S Lemon Ave #4133<br />
                        Walnut, CA 91789<br />
                        États-Unis
                    </p>

                    <h2>3. Propriété intellectuelle</h2>
                    <p>
                        L’ensemble de ce site relève de la législation française et internationale sur le droit d’auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>

                    <h2>4. Données personnelles</h2>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, veuillez consulter notre <a href="/legal/politique-de-confidentialite">Politique de Confidentialité</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
