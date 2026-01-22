import Header from '@/components/header';
import Footer from '@/components/footer';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-5xl w-full px-6 py-16">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <h1 className="text-4xl font-serif mb-6">Contactez-nous</h1>
                        <p className="text-zinc-500 mb-8 font-light leading-relaxed">
                            Une question sur une commande, une taille ou un produit ? Notre équipe est là pour vous accompagner.
                            Remplissez le formulaire ou utilisez nos coordonnées directes.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Email</h3>
                                <p className="text-zinc-900">contact@tsniout-shop.fr</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">WhatsApp / Tel</h3>
                                <p className="text-zinc-900">+33 1 23 45 67 89</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Horaires</h3>
                                <p className="text-zinc-900">Du Lundi au Vendredi : 9h00 - 18h00</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 p-8 rounded-lg">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nom complet</label>
                                <input type="text" className="w-full bg-white border border-zinc-200 p-3 text-sm focus:border-zinc-900 outline-none transition-all" placeholder="Votre nom" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                                <input type="email" className="w-full bg-white border border-zinc-200 p-3 text-sm focus:border-zinc-900 outline-none transition-all" placeholder="votre@email.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Message</label>
                                <textarea className="w-full bg-white border border-zinc-200 p-3 text-sm focus:border-zinc-900 outline-none transition-all min-h-[150px]" placeholder="Votre message..."></textarea>
                            </div>
                            <button disabled className="w-full bg-zinc-900 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                Envoyer le message
                            </button>
                            <p className="text-[10px] text-zinc-400 text-center italic">Le formulaire est actuellement en mode démonstration.</p>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
