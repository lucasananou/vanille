'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';

const EmailIcon = () => (
    <svg className="w-5 h-5 text-deepgreen-800" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5 text-deepgreen-800" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const SendIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);

export default function ContactPage() {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Message envoyé (démo).');
        setTimeout(() => setStatus(null), 2200);
    };

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                <section className="relative overflow-hidden py-16 lg:py-24">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 relative">
                        <div className="grid lg:grid-cols-2 gap-10 items-start">
                            <div>
                                <h1 className="font-display text-4xl text-vanilla-50 italic">Contact</h1>
                                <p className="text-vanilla-100/70 mt-4 text-lg">
                                    Ajoutez vos coordonnées réelles (email, téléphone, horaires). Rien n'est inventé ici.
                                </p>
                                <div className="mt-6 space-y-4">
                                    <div className="rounded-xxl glass p-5 border border-vanilla-100/10">
                                        <p className="text-sm font-semibold text-vanilla-50 flex items-center gap-2">
                                            <EmailIcon />
                                            Email
                                        </p>
                                        <p className="text-sm text-vanilla-100/70 mt-2">[Email]</p>
                                    </div>
                                    <div className="rounded-xxl glass p-5 border border-vanilla-100/10">
                                        <p className="text-sm font-semibold text-vanilla-50 flex items-center gap-2">
                                            <PhoneIcon />
                                            Téléphone / WhatsApp
                                        </p>
                                        <p className="text-sm text-vanilla-100/70 mt-2">[Téléphone]</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xxl glass p-6 border border-vanilla-100/10">
                                <h2 className="font-display text-2xl text-vanilla-50">Envoyer un message</h2>
                                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-vanilla-50" htmlFor="name">Nom</label>
                                            <input
                                                id="name"
                                                required
                                                className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder="Votre nom"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-vanilla-50" htmlFor="email">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder="vous@exemple.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-vanilla-50" htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                            placeholder="Écrivez votre message…"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-jungle-900 hover:opacity-90 transition-all font-bold"
                                    >
                                        Envoyer <SendIcon />
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
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-full bg-cocoa-900 text-white text-sm border border-vanilla-100/20 transition-all animate-fade-in-up">
                    {status}
                </div>
            )}
        </div>
    );
}
