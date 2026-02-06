'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useCart } from '@/lib/cart-context';
import { useState } from 'react';
import Link from 'next/link';

const CreditCardIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function CheckoutPage() {
    const { items, total } = useCart();
    const [status, setStatus] = useState<string | null>(null);
    const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Commande confirmée ! Vous allez recevoir un email récapitulatif.');
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                <section className="relative py-12 lg:py-20 overflow-hidden">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="mx-auto max-w-7xl px-4 relative">
                        <div className="mb-10">
                            <h1 className="font-display text-4xl sm:text-5xl italic text-white">Finalisation</h1>
                            <p className="text-vanilla-100/60 mt-3 text-lg">
                                Vos coordonnées et votre paiement sécurisé.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-10 items-start">
                            <div className="lg:col-span-2 rounded-3xl glass border border-vanilla-100/10 p-8">
                                <h2 className="font-display text-2xl italic mb-8 text-white">Informations de livraison</h2>
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-vanilla-100/80" htmlFor="fn">Prénom</label>
                                            <input
                                                id="fn"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-vanilla-50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-vanilla-100/80" htmlFor="ln">Nom</label>
                                            <input
                                                id="ln"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-vanilla-50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-vanilla-100/80" htmlFor="em">Email de contact</label>
                                        <input
                                            id="em"
                                            type="email"
                                            required
                                            className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all text-vanilla-50"
                                        />
                                    </div>

                                    <div className="rounded-2xl bg-vanilla-50/5 border border-vanilla-100/10 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                                                <CreditCardIcon />
                                            </div>
                                            <div>
                                                <p className="font-display text-lg text-white">Paiement Sécurisé</p>
                                                <p className="text-xs text-vanilla-100/50">Cryptage SSL 256 bits</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-vanilla-100/70 italic">
                                            Simulation de paiement : les transactions réelles ne sont pas encore actives sur cette version de démonstration.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-8 py-5 text-lg font-bold text-jungle-900 hover:opacity-90 transition-all font-bold"
                                    >
                                        Confirmer la commande <CheckCircleIcon />
                                    </button>
                                </form>
                            </div>

                            <aside className="rounded-3xl glass border border-vanilla-100/15 overflow-hidden">
                                <div className="p-8 bg-vanilla-50/5 border-b border-vanilla-100/10">
                                    <h2 className="font-display text-2xl italic text-white">Récapitulatif</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    {items.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-sm text-vanilla-100/60">Votre panier est vide.</p>
                                            <Link href="/" className="text-gold-500 hover:underline text-sm font-bold mt-4 inline-block">
                                                Boutique
                                            </Link>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-start gap-4">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold truncate text-white">{item.product.title}</p>
                                                            <p className="text-xs text-vanilla-100/50 mt-1">Qté: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium whitespace-nowrap text-white">{fmt.format((item.price / 100) * item.quantity)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-6 border-t border-vanilla-100/10">
                                                <div className="flex justify-between items-center text-sm text-vanilla-100/60 mb-2">
                                                    <span>Sous-total</span>
                                                    <span>{fmt.format(total / 100)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-vanilla-100/60 mb-6">
                                                    <span>Livraison</span>
                                                    <span className="text-gold-500 font-bold uppercase tracking-wider text-[10px]">Offerte</span>
                                                </div>
                                                <div className="flex justify-between items-center text-2xl font-display text-white border-t border-vanilla-100/5 pt-4">
                                                    <span>Total</span>
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-vanilla-100">{fmt.format(total / 100)}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Toast */}
            {status && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-full glass border border-gold-500/20 text-vanilla-50 text-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
                        {status}
                    </div>
                </div>
            )}
        </div>
    );
}
