'use client';

import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';

// --- Icons ---
const VanillaIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const SealIcon = () => ( // check-decagram-outline
    <svg className="w-5 h-5 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const TruckIcon = () => (
    <svg className="w-5 h-5 text-gold-600 mb-1 mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 17h4M14 17h6v-6.17a1 1 0 0 0-.29-.71l-2.83-2.83a1 1 0 0 0-.71-.29H14v5h-4V5H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
    </svg>
);

const MessageIcon = () => (
    <svg className="w-5 h-5 text-gold-600 mb-1 mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function CheckoutPage() {
    const { items, total } = useCart();
    const [status, setStatus] = useState<string | null>(null);
    const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
    const subtotal = total / 100;
    const shipping = 0; // Configurable
    const totalWithShipping = subtotal + shipping;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Paiement simulé validé. Merci pour votre commande !');
        setTimeout(() => setStatus(null), 4000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-cacao-900 font-sans antialiased">

            {/* HEADLESS HEADER (Custom for Checkout) */}
            <header
                className="sticky top-0 z-50 border-b border-vanilla-100/15 backdrop-blur text-vanilla-50"
                style={{ backgroundColor: 'rgba(10, 44, 29, 0.7)' }} // Forced Green #0a2c1d with opacity
            >
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-1 focus:ring-2 focus:ring-gold-500/50 outline-none">
                        <div className="w-10 h-10 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/15 grid place-items-center">
                            <VanillaIcon />
                        </div>
                        <div className="leading-tight">
                            <p className="font-display text-lg text-vanilla-50">MSV Nosy-Be</p>
                            <p className="text-xs text-vanilla-100/70">Checkout</p>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1 text-sm text-vanilla-100/85">
                        <Link href="/shop" className="px-4 py-2 rounded-full hover:bg-vanilla-50/10">Boutique</Link>
                        <Link href="/about" className="px-4 py-2 rounded-full hover:bg-vanilla-50/10">À propos</Link>
                        <Link href="/contact" className="px-4 py-2 rounded-full hover:bg-vanilla-50/10">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Link href="/cart" className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:shadow-lg transition-all">
                            Retour panier
                            <ArrowRightIcon />
                        </Link>
                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold bg-white/5 border border-vanilla-100/15 backdrop-blur text-vanilla-50">
                            <span className="text-gold-500"><LockIcon /></span>
                            Paiement sécurisé
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* HERO */}
                <section className="relative overflow-hidden text-vanilla-50" style={{ backgroundColor: '#0a2c1d' }}>
                    <div className="absolute inset-0 shine grain" aria-hidden="true"></div>
                    <div className="relative mx-auto max-w-7xl px-4 py-9">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-vanilla-100/15 backdrop-blur px-4 py-2 text-vanilla-50">
                                    <SealIcon />
                                    <span className="text-sm font-semibold">Finalisation</span>
                                    <span className="text-sm text-vanilla-100/70">• 2 minutes chrono</span>
                                </div>
                                <h1 className="mt-4 font-display text-3xl sm:text-4xl text-vanilla-50 leading-[1.06]">
                                    Checkout
                                </h1>
                                <p className="mt-3 text-sm text-vanilla-100/75 max-w-2xl">
                                    Renseignez vos informations, choisissez la livraison, puis validez le paiement.
                                </p>
                            </div>

                            <div className="rounded-[22px] bg-white/5 border border-vanilla-100/15 backdrop-blur p-4 w-full lg:w-[420px]">
                                <p className="text-sm font-semibold text-vanilla-50">Récap rapide</p>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <span className="text-vanilla-100/70">Sous-total</span>
                                    <span className="font-semibold text-vanilla-50">{fmt.format(subtotal)}</span>
                                </div>
                                <p className="mt-2 text-xs text-vanilla-100/60">Livraison & taxes calculées selon adresse.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CHECKOUT CONTENT */}
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN: FORMS */}
                        <section className="lg:col-span-7 space-y-4">
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                {/* Contact */}
                                <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="font-display text-2xl text-jungle-950">Informations</h2>
                                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-vanilla-100 border border-cacao-900/10 text-cacao-700">
                                            <span className="text-gold-600"><ShieldIcon /></span>
                                            Données protégées
                                        </span>
                                    </div>

                                    <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="email">Email</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="email" type="email" placeholder="vous@exemple.com" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="phone">Téléphone</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="phone" type="tel" placeholder="+33…" />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                    <h2 className="font-display text-2xl text-jungle-950">Adresse de livraison</h2>
                                    <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="firstName">Prénom</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="firstName" type="text" placeholder="Prénom" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="lastName">Nom</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="lastName" type="text" placeholder="Nom" required />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="address">Adresse</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="address" type="text" placeholder="N° et rue" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="zip">Code postal</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="zip" type="text" placeholder="00000" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-cacao-700" htmlFor="city">Ville</label>
                                            <input className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all" id="city" type="text" placeholder="Ville" required />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Placeholder */}
                                <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="font-display text-2xl text-jungle-950">Paiement</h2>
                                        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-vanilla-100 border border-cacao-900/10 text-cacao-700">
                                            <span className="text-gold-600"><LockIcon /></span>
                                            PCI / 3DS
                                        </span>
                                    </div>
                                    <div className="mt-5 rounded-2xl bg-white/80 border border-cacao-900/10 p-4">
                                        <p className="text-sm text-cacao-700">
                                            UI prête à brancher (Stripe / autre). Pour l’instant, le bouton "Valider & payer" simule la transaction.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </section>

                        {/* RIGHT COLUMN: SUMMARY */}
                        <aside className="lg:col-span-5">
                            <div className="lg:sticky lg:top-24 space-y-4">
                                <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-3 mb-5">
                                        <h3 className="font-display text-xl text-jungle-950">Récapitulatif</h3>
                                        <Link href="/cart" className="text-sm font-semibold text-cacao-700 hover:text-cacao-900 underline underline-offset-4">
                                            Modifier
                                        </Link>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="text-center py-6">
                                            <p className="text-sm text-cacao-600">Votre panier est vide.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {items.map((item) => (
                                                <div key={item.id} className="rounded-2xl bg-white/80 border border-cacao-900/10 p-4 flex gap-3">
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-cacao-900/10 overflow-hidden shrink-0">
                                                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-cacao-900 truncate">{item.product.title}</p>
                                                        <p className="mt-1 text-sm text-cacao-700">{item.quantity} × {fmt.format(item.price / 100)}</p>
                                                    </div>
                                                    <p className="font-semibold text-cacao-900">{fmt.format((item.price / 100) * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-5 rounded-2xl bg-white/80 border border-cacao-900/10 p-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-cacao-700">
                                            <span>Sous-total</span>
                                            <span className="font-semibold">{fmt.format(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-cacao-700">
                                            <span>Livraison</span>
                                            <span className="font-semibold">{shipping === 0 ? 'Offerte' : fmt.format(shipping)}</span>
                                        </div>
                                        <div className="pt-4 border-t border-cacao-900/10 flex justify-between font-display text-xl text-jungle-950">
                                            <span>Total</span>
                                            <span>{fmt.format(totalWithShipping)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => document.getElementById('checkout-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-4 text-sm font-bold text-jungle-900 hover:shadow-lg transition-all"
                                    >
                                        Valider & payer
                                        <LockIcon />
                                    </button>

                                    {/* Trust Cards */}
                                    <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                                        <div className="rounded-2xl bg-white/80 border border-cacao-900/10 p-3 text-center text-cacao-500">
                                            <div className="flex justify-center mb-1 text-gold-600"><ShieldIcon /></div>
                                            <p className="font-semibold text-cacao-900">Sécurisé</p>
                                            <p>SSL 256 bits</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/80 border border-cacao-900/10 p-3 text-center text-cacao-500">
                                            <div className="flex justify-center mb-1 text-gold-600"><TruckIcon /></div>
                                            <p className="font-semibold text-cacao-900">Livraison</p>
                                            <p>Suivie 48h</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/80 border border-cacao-900/10 p-3 text-center text-cacao-500">
                                            <div className="flex justify-center mb-1 text-gold-600"><MessageIcon /></div>
                                            <p className="font-semibold text-cacao-900">Support</p>
                                            <p>7j/7</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] bg-white/70 border border-cacao-900/10 p-5">
                                    <p className="text-sm font-semibold text-jungle-950">Anti-abandon</p>
                                    <ul className="mt-3 space-y-2 text-sm text-cacao-700">
                                        <li className="flex gap-2"><CheckCircleIcon /> Formulaire 100% sécurisé</li>
                                        <li className="flex gap-2"><CheckCircleIcon /> Expédition sous 24h</li>
                                        <li className="flex gap-2"><CheckCircleIcon /> Satisfait ou remboursé</li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur border-t border-cacao-900/10 safe-area-pb">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs text-cacao-600">Total</p>
                        <p className="text-base font-semibold text-jungle-950">{fmt.format(totalWithShipping)}</p>
                    </div>
                    <button
                        onClick={() => document.getElementById('checkout-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 shadow-lg"
                    >
                        Payer
                        <LockIcon />
                    </button>
                </div>
            </div>

            {/* Toast */}
            {status && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="rounded-full bg-jungle-900 text-vanilla-50 px-6 py-3 shadow-2xl flex items-center gap-3 border border-vanilla-100/10">
                        <SealIcon />
                        <p className="text-sm font-semibold">{status}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

