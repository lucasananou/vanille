'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const BuildingIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
);

export default function B2BPage() {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Demande de devis envoyée. Notre équipe commerciale vous recontactera.');
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                <section className="relative py-16 lg:py-24 overflow-hidden">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="mx-auto max-w-7xl px-4 relative">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            <div className="max-w-xl">
                                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
                                    Professionnels <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-vanilla-100 italic">
                                        & Gastronomie.
                                    </span>
                                </h1>
                                <p className="text-vanilla-100/70 mt-6 text-lg">
                                    Chef pâtissier, chocolatier ou distributeur ? Accédez à des volumes importants et des tarifs préférentiels pour sublimer vos créations.
                                </p>

                                <div className="mt-10 space-y-6">
                                    <div className="rounded-xxl glass p-6 border border-vanilla-100/10 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-vanilla-50/5 border border-vanilla-100/10 flex items-center justify-center shrink-0">
                                            <BuildingIcon />
                                        </div>
                                        <div>
                                            <p className="font-display text-xl text-gold-500">Service Dédié</p>
                                            <p className="text-vanilla-100/70 mt-1">Accompagnement personnalisé, facturation HT et expédition sécurisée monde entier.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl glass border border-vanilla-100/15 p-8 relative">
                                <h2 className="font-display text-3xl italic">Demande de devis</h2>
                                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-vanilla-100/80" htmlFor="company">Entreprise / Restaurant</label>
                                            <input
                                                id="company"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder:text-vanilla-100/30 text-vanilla-50"
                                                placeholder="Nom de l’établissement"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-vanilla-100/80" htmlFor="b2bemail">Email pro</label>
                                            <input
                                                id="b2bemail"
                                                type="email"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder:text-vanilla-100/30 text-vanilla-50"
                                                placeholder="contact@entreprise.fr"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-vanilla-100/80" htmlFor="need">Votre besoin (Volumes, Types...)</label>
                                        <textarea
                                            id="need"
                                            rows={5}
                                            required
                                            className="w-full rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all placeholder:text-vanilla-100/30 text-vanilla-50"
                                            placeholder="Ex: 5kg Gousses TK, Livraison mensuelle..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-8 py-4 text-sm font-bold text-jungle-900 hover:opacity-90 transition-all"
                                    >
                                        Envoyer ma demande <ArrowRightIcon />
                                    </button>
                                </form>
                            </div>
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
