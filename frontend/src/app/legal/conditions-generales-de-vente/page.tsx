
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function CGV() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-12">
                <h1 className="text-3xl font-serif mb-8 text-center text-zinc-900">Conditions Générales de Vente (CGV)</h1>

                <div className="prose prose-zinc max-w-none">
                    <p className="text-sm text-zinc-500 italic mb-8">Dernière mise à jour : 20 Octobre 2024</p>

                    <h2>1. Objet</h2>
                    <p>
                        Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>Tsniout Shop</strong> et toute personne effectuant un achat via le site e-commerce <strong>tsniout-shop.fr</strong>.
                    </p>

                    <h2>2. Produits et Prix</h2>
                    <p>
                        Nos produits sont décrits avec la plus grande précision possible. Les prix sont indiqués en Euros (€) toutes taxes comprises (TTC). Les frais de livraison sont calculés lors du passage de la commande.
                    </p>

                    <h2>3. Commande</h2>
                    <p>
                        Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente. La validation de la commande entraîne l'acceptation des présentes CGV.
                    </p>

                    <h2>4. Paiement</h2>
                    <p>
                        Le paiement est exigible immédiatement à la commande. Vous pouvez effectuer le règlement par carte bancaire. Les paiements sont sécurisés par notre partenaire de paiement.
                    </p>

                    <h2>5. Livraison</h2>
                    <p>
                        La livraison est effectuée à l'adresse indiquée lors de la commande. Les délais de livraison sont donnés à titre indicatif. Pour plus de détails, consultez notre <a href="/legal/politique-d-expedition">Politique d'Expédition</a>.
                    </p>

                    <h2>6. Rétractation</h2>
                    <p>
                        Conformément à la loi, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation. Voir notre <a href="/legal/politique-de-remboursement">Politique de Remboursement</a>.
                    </p>

                    <h2>7. Garanties</h2>
                    <p>
                        Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
