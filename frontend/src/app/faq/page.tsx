import Header from '@/components/header';
import Footer from '@/components/footer';

const faqs = [
    {
        question: "Quels sont les délais de livraison ?",
        answer: "Nous expédions vos commandes sous 24h à 48h (hors week-end et jours fériés). La livraison prend ensuite généralement 2 à 3 jours ouvrables pour la France métropolitaine via nos transporteurs partenaires."
    },
    {
        question: "Proposez-vous des retours ?",
        answer: "Oui, vous disposez de 14 jours après réception de votre colis pour nous le retourner s'il ne vous convient pas. L'article doit être dans son état d'origine, non porté et avec ses étiquettes."
    },
    {
        question: "Comment choisir ma taille ?",
        answer: "Chaque fiche produit contient des indications sur la coupe. Vous pouvez également consulter notre Guide des Tailles dédié pour trouver la correspondance exacte de vos mesures."
    },
    {
        question: "Les articles sont-ils transparents ?",
        answer: "Nous apportons une attention particulière à l'opacité de nos tissus. La plupart de nos robes et jupes sont doublées ou conçues dans des matières denses pour garantir une opacité totale, conformément aux principes de la Tsniout."
    },
    {
        question: "Puis-je modifier ma commande après validation ?",
        answer: "Si votre commande n'a pas encore été expédiée, nous pouvons essayer de la modifier. Contactez-nous au plus vite via notre formulaire de contact ou par e-mail."
    }
];

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-3xl w-full px-6 py-16">
                <h1 className="text-4xl font-serif mb-4 text-center">Foire Aux Questions</h1>
                <p className="text-zinc-500 text-center mb-12 font-light">Toutes les réponses à vos questions sur Tsniout Shop.</p>

                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-zinc-100 pb-8">
                            <h3 className="text-lg font-medium text-zinc-900 mb-3">{faq.question}</h3>
                            <p className="text-zinc-500 leading-relaxed font-light">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-zinc-50 rounded-lg text-center">
                    <h2 className="text-xl font-serif mb-4">Encore des questions ?</h2>
                    <p className="text-zinc-500 mb-6 font-light text-sm">Notre équipe est à votre disposition pour vous aider.</p>
                    <a href="/contact" className="inline-block bg-zinc-900 text-white px-8 py-3 text-sm font-medium transition-all hover:bg-zinc-800">
                        Nous contacter
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
}
