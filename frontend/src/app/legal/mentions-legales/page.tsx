
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
                        Le site <strong>M.S.V-NOSY BE</strong> (ci-après dénommé « le Site ») est édité par :<br />
                        <strong>MORIDY SOANJARA VANILLE NOSY-BE (M.S.V – NOSY BE)</strong><br />
                        Siège social : Lot n°109B 0163 à Befitina, Hell-Ville, Nosy-Be, Madagascar<br />
                        Email : <a href="mailto:contact@vanille-nosybe.fr">contact@vanille-nosybe.fr</a><br />
                        Tél : +261 32 98 595 50<br />
                        RCS Nosy-Be 2023 B 00054<br />
                        Directeur de la publication : ABOU MORIDY
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
