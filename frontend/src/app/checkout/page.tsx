'use client';

import { useCart } from '@/lib/cart-context';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/lib/api/payments';
import StripeForm from '@/components/checkout/stripe-form';

// Initialize Stripe outside of component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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

const SealIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1-1z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default function CheckoutPage() {
    const { items, total } = useCart();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoadingSecret, setIsLoadingSecret] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        zip: '',
        city: '',
    });

    const fmt = useMemo(() => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }), []);
    const subtotal = total / 100;
    const shipping = 0; // Temporairement gratuit
    const totalWithShipping = subtotal + shipping;

    useEffect(() => {
        const getSecret = async () => {
            if (total > 0 && !clientSecret && !isLoadingSecret) {
                setIsLoadingSecret(true);
                try {
                    // Call backend with total in cents
                    const res = await paymentsApi.createPaymentIntent(total);
                    setClientSecret(res.clientSecret);
                } catch (err) {
                    console.error('Failed to get client secret:', err);
                } finally {
                    setIsLoadingSecret(false);
                }
            }
        };
        getSecret();
    }, [total, clientSecret, isLoadingSecret]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-cacao-900 font-sans antialiased">

            {/* HEADLESS HEADER */}
            <header
                className="sticky top-0 z-50 border-b border-vanilla-100/15 backdrop-blur text-vanilla-50"
                style={{ backgroundColor: 'rgba(10, 44, 29, 0.7)' }}
            >
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-1 focus:ring-2 focus:ring-gold-500/50 outline-none">
                        <div className="w-10 h-10 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/15 grid place-items-center">
                            <VanillaIcon />
                        </div>
                        <div className="leading-tight">
                            <p className="font-display text-lg text-vanilla-50">M.S.V-NOSY BE</p>
                            <p className="text-xs text-vanilla-100/70">Checkout</p>
                        </div>
                    </Link>

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
                                <p className="text-sm font-semibold text-vanilla-50">Récapitulatif total</p>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <span className="text-vanilla-100/70">Total à payer</span>
                                    <span className="font-semibold text-2xl text-vanilla-50">{fmt.format(totalWithShipping)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN: FORMS */}
                        <div className="lg:col-span-7 space-y-4">
                            {/* Contact Section */}
                            <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="font-display text-2xl text-jungle-950">1. Vos informations</h2>
                                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-vanilla-100 border border-cacao-900/10 text-cacao-700">
                                        <span className="text-gold-600"><ShieldIcon /></span>
                                        Données protégées
                                    </span>
                                </div>

                                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="email">Email</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="email" type="email" placeholder="vous@exemple.com" required
                                            value={formData.email} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="phone">Téléphone</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="phone" type="tel" placeholder="+33…"
                                            value={formData.phone} onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="firstName">Prénom</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="firstName" type="text" placeholder="Jan" required
                                            value={formData.firstName} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="lastName">Nom</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="lastName" type="text" placeholder="Dupont" required
                                            value={formData.lastName} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="address">Adresse</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="address" type="text" placeholder="123 rue de la Vanille" required
                                            value={formData.address} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="zip">Code postal</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="zip" type="text" placeholder="75000" required
                                            value={formData.zip} onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="city">Ville</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="city" type="text" placeholder="Paris" required
                                            value={formData.city} onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stripe Section */}
                            <div className="mt-6">
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, locale: 'fr', appearance: { theme: 'stripe' } }}>
                                        <StripeForm
                                            formData={formData}
                                            total={total}
                                            subtotal={total}
                                            shipping={shipping}
                                            tax={0}
                                        />
                                    </Elements>
                                ) : (
                                    <div className="rounded-[28px] bg-white/80 p-12 text-center border border-cacao-900/10">
                                        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-sm text-cacao-700">Initialisation du paiement sécurisé...</p>
                                    </div>
                                )}
                            </div>
                        </div>

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
                                                <div key={item.id} className="rounded-2xl bg-white border border-cacao-900/5 p-4 flex gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-vanilla-50 border border-cacao-900/5 overflow-hidden shrink-0">
                                                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-cacao-900 truncate">{item.product.title}</p>
                                                        <p className="mt-1 text-sm text-cacao-700">{item.quantity} × {fmt.format(item.price / 100)}</p>
                                                    </div>
                                                    <p className="font-semibold text-cacao-900">{fmt.format((item.price / 100) * item.quantity)}</p>
                                                </div>
                                            ))}

                                            <div className="mt-6 pt-6 border-t border-cacao-900/10 space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-cacao-700">Sous-total</span>
                                                    <span className="font-semibold">{fmt.format(subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-cacao-700">Livraison</span>
                                                    <span className="text-gold-600 font-bold">Gratuite</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-display pt-3 border-t border-cacao-900/10">
                                                    <span className="text-jungle-950">Total</span>
                                                    <span className="text-jungle-950">{fmt.format(totalWithShipping)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
