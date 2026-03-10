'use client';

import { useCart } from '@/lib/cart-context';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/lib/api/payments';
import { productsApi } from '@/lib/api/products';
import { normalizeProductRef } from '@/lib/product-refs';
import { shippingApi, ShippingRate } from '@/lib/api/shipping';
import StripeForm from '@/components/checkout/stripe-form';
import PayPalButton from '@/components/checkout/paypal-button';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';

// Initialize Stripe outside of component
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

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
    const SHIPPING_LAUNCH_DISCOUNT_RATE = 0.5;
    const router = useRouter();
    const { items, total, clearCart } = useCart();
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
        country: 'FR',
    });
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paypalError, setPaypalError] = useState<string | null>(null);
    const [isFinalizingPayPal, setIsFinalizingPayPal] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [availableRates, setAvailableRates] = useState<ShippingRate[]>([]);
    const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
    const [isLoadingRates, setIsLoadingRates] = useState(false);

    const fmt = useMemo(() => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }), []);
    const subtotal = total / 100;
    const originalShipping = selectedRate ? selectedRate.price / 100 : 0;
    const shippingDiscount = originalShipping * SHIPPING_LAUNCH_DISCOUNT_RATE;
    const shipping = Math.max(0, originalShipping - shippingDiscount);
    const totalWithShipping = subtotal + shipping;
    const isCheckoutDataValid = Boolean(
        formData.email &&
        formData.firstName &&
        formData.lastName &&
        formData.address &&
        formData.zip &&
        formData.city &&
        items.length > 0
    );

    useEffect(() => {
        const getSecret = async () => {
            if (paymentMethod !== 'stripe') return;
            if (!stripePromise) {
                setPaymentError("Paiement Stripe indisponible: clé publique manquante (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).");
                return;
            }
            if (totalWithShipping > 0 && !isLoadingSecret) {
                setIsLoadingSecret(true);
                setPaymentError(null);
                try {
                    // Call backend with total in cents
                    const res = await paymentsApi.createPaymentIntent(Math.round(totalWithShipping * 100));
                    setClientSecret(res.clientSecret);
                } catch (err) {
                    console.error('Failed to get client secret:', err);
                    setPaymentError("Impossible d'initialiser le paiement Stripe.");
                } finally {
                    setIsLoadingSecret(false);
                }
            }
        };
        getSecret();
    }, [totalWithShipping, paymentMethod]);

    useEffect(() => {
        if (paymentMethod !== 'stripe') {
            setClientSecret(null);
            setPaymentError(null);
        }
    }, [paymentMethod]);

    const buildOrderPayload = useCallback(async () => {
        const resolvedProducts = new Map<string, Product>();

        const resolveProduct = async (ref: string) => {
            if (!resolvedProducts.has(ref)) {
                const product = await productsApi.getProductBySlug(ref);
                resolvedProducts.set(ref, product);
            }
            return resolvedProducts.get(ref)!;
        };

        const normalizedItems = await Promise.all(
            items.map(async (item) => {
                const productRef = normalizeProductRef(item.product?.slug || item.productId);
                const product = await resolveProduct(productRef);

                return {
                    productId: product.id,
                    variantId: undefined,
                    quantity: item.quantity,
                    price: item.price,
                };
            }),
        );

        return {
            email: formData.email,
            shippingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                address1: formData.address,
                city: formData.city,
                postalCode: formData.zip,
                country: formData.country || 'FR',
                phone: formData.phone,
            },
            items: normalizedItems,
            shippingCost: Math.round(shipping * 100),
            tax: 0,
            shippingRateId: selectedRate?.id,
        };
    }, [formData, items, shipping, selectedRate]);

    const handlePayPalApproved = useCallback(async (paypalOrderId: string) => {
        setIsFinalizingPayPal(true);
        setPaypalError(null);
        try {
            const orderPayload = await buildOrderPayload();
            const result = await paymentsApi.finalizePayPalOrder(paypalOrderId, orderPayload);
            clearCart();
            router.push(`/order-confirmation/${result.orderId}`);
        } catch (error: any) {
            console.error('PayPal finalization failed:', error);
            setPaypalError(error?.message || 'Le paiement PayPal a échoué.');
        } finally {
            setIsFinalizingPayPal(false);
        }
    }, [buildOrderPayload, router, clearCart]);

    const handlePayPalError = useCallback((message: string) => {
        setPaypalError(message);
    }, []);

    useEffect(() => {
        const fetchRates = async () => {
            if (formData.country && total > 0) {
                setIsLoadingRates(true);
                try {
                    const res = await shippingApi.calculateAvailableRates(formData.country, total);

                    if (res.availableRates && res.availableRates.length > 0) {
                        setAvailableRates(res.availableRates);
                        if (!selectedRate) setSelectedRate(res.availableRates[0]);
                    } else {
                        throw new Error('No rates returned');
                    }
                } catch (err) {
                    console.error('Shipping rates fetch failed or empty, using fallbacks:', err);
                    const fallbacks: ShippingRate[] = [
                        { id: 'lettre', name: 'Lettre Suivie (Recommandé)', price: 350, estimatedDays: '3-5 jours', zoneName: 'Standard' },
                        { id: 'colissimo', name: 'Colissimo Domicile', price: 695, estimatedDays: '2-3 jours', zoneName: 'Standard' },
                        { id: 'gratuit', name: 'Livraison Gratuite', price: 0, estimatedDays: '3-5 jours', zoneName: 'Standard' }
                    ];

                    // Logic for free shipping fallback on frontend
                    const applicableFallbacks = total >= 7500
                        ? [fallbacks[2]]
                        : [fallbacks[0], fallbacks[1]];

                    setAvailableRates(applicableFallbacks);
                    setSelectedRate(applicableFallbacks[0]);
                } finally {
                    setIsLoadingRates(false);
                }
            }
        };
        fetchRates();
    }, [formData.country, total]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        // Address search for France
        if (id === 'address' && value.length > 5 && formData.country === 'FR') {
            searchAddress(value);
        } else if (id === 'address') {
            setAddressSuggestions([]);
        }
    };

    const searchAddress = async (query: string) => {
        try {
            const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            setAddressSuggestions(data.features || []);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Address search failed', err);
        }
    };

    const selectAddress = (feature: any) => {
        const { name, postcode, city } = feature.properties;
        setFormData(prev => ({
            ...prev,
            address: name,
            zip: postcode,
            city: city
        }));
        setAddressSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-cacao-900 font-sans antialiased">

            {/* HEADLESS HEADER */}
            <header
                className="sticky top-0 z-50 border-b border-vanilla-100/15 backdrop-blur text-vanilla-50"
                style={{ backgroundColor: 'rgba(10, 44, 29, 0.7)' }}
            >
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <Link href="/" className="flex items-center gap-3 rounded-2xl px-1 py-1 focus:ring-2 focus:ring-gold-500/50 outline-none">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden">
                            <img
                                src="/logo_msv.png"
                                alt="Logo MSV Nosy-Be"
                                className="w-full h-full object-contain"
                            />
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
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold-500/20 border border-gold-500/50 px-4 py-2 text-gold-100">
                                    <span className="text-sm font-semibold">Offre lancement: -50% sur la livraison</span>
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
                                            autoComplete="email"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="phone">Téléphone</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="phone" type="tel" placeholder="+33…"
                                            value={formData.phone} onChange={handleInputChange}
                                            autoComplete="tel"
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
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="lastName">Nom</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="lastName" type="text" placeholder="Dupont" required
                                            value={formData.lastName} onChange={handleInputChange}
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 relative z-30">
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="address">Adresse</label>
                                        <div className="relative">
                                            <input
                                                className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                                id="address" type="text" placeholder="123 rue de la Vanille" required
                                                value={formData.address} onChange={handleInputChange}
                                                autoComplete="address-line1"
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                                            />
                                            {showSuggestions && addressSuggestions.length > 0 && (
                                                <div className="absolute z-[100] w-full mt-1 bg-white border border-cacao-900/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
                                                    {addressSuggestions.map((suggestion, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => selectAddress(suggestion)}
                                                            className="w-full text-left px-4 py-3 text-sm hover:bg-gold-50 transition-colors border-b border-cacao-900/5 last:border-0"
                                                        >
                                                            <p className="font-semibold text-jungle-950">{suggestion.properties.label}</p>
                                                            <p className="text-xs text-cacao-600">{suggestion.properties.context}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="zip">Code postal</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="zip" type="text" placeholder="75000" required
                                            value={formData.zip} onChange={handleInputChange}
                                            autoComplete="postal-code"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="city">Ville</label>
                                        <input
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all"
                                            id="city" type="text" placeholder="Paris" required
                                            value={formData.city} onChange={handleInputChange}
                                            autoComplete="address-level2"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-cacao-700" htmlFor="country">Pays</label>
                                        <select
                                            className="w-full mt-2 rounded-full border border-cacao-900/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/25 transition-all appearance-none"
                                            id="country" required
                                            value={formData.country} onChange={handleInputChange}
                                            autoComplete="country-name"
                                        >
                                            <option value="FR">France</option>
                                            <option value="BE">Belgique</option>
                                            <option value="CH">Suisse</option>
                                            <option value="LU">Luxembourg</option>
                                            <option value="RE">Réunion (974)</option>
                                            <option value="MG">Madagascar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Section */}
                            <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                                <div className="flex items-center justify-between gap-3 mb-6">
                                    <h2 className="font-display text-2xl text-jungle-950">2. Mode de livraison</h2>
                                    {isLoadingRates && <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>}
                                </div>

                                <div className="space-y-3">
                                    {availableRates.length > 0 ? (
                                        availableRates.map((rate) => (
                                            <label
                                                key={rate.id}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedRate?.id === rate.id
                                                    ? 'border-gold-500 bg-gold-50/30 ring-1 ring-gold-500'
                                                    : 'border-cacao-900/5 bg-white hover:border-cacao-900/15'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRate?.id === rate.id ? 'border-gold-500' : 'border-cacao-200'}`}>
                                                        {selectedRate?.id === rate.id && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-cacao-900">{rate.name}</p>
                                                        <p className="text-xs text-cacao-600">{rate.estimatedDays}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {rate.price === 0 ? (
                                                        <p className="font-bold text-cacao-900">Gratuit</p>
                                                    ) : (
                                                        <>
                                                            <p className="text-xs text-cacao-500 line-through">{fmt.format(rate.price / 100)}</p>
                                                            <p className="font-bold text-cacao-900">{fmt.format((rate.price / 100) * (1 - SHIPPING_LAUNCH_DISCOUNT_RATE))}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="shippingRate"
                                                    className="sr-only"
                                                    checked={selectedRate?.id === rate.id}
                                                    onChange={() => setSelectedRate(rate)}
                                                />
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-cacao-600 italic">Aucun mode de livraison disponible pour cette destination.</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Method Selector */}
                            <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm mt-6">
                                <h2 className="font-display text-2xl text-jungle-950 mb-6">3. Mode de paiement</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-gold-500 bg-gold-50/30' : 'border-cacao-900/5 hover:border-cacao-900/15'}`}
                                    >
                                        <div className="flex gap-2 mb-2">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto" />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3 w-auto opacity-50" />
                                        </div>
                                        <p className="text-sm font-semibold">Carte bancaire</p>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'paypal' ? 'border-gold-500 bg-gold-50/30' : 'border-cacao-900/5 hover:border-cacao-900/15'}`}
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 w-auto mb-2" />
                                        <p className="text-sm font-semibold">PayPal</p>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Integration */}
                            <div className="mt-6">
                                {paymentMethod === 'stripe' ? (
                                    paymentError ? (
                                        <div className="rounded-[28px] bg-red-50 border border-red-200 p-6 text-center">
                                            <p className="text-sm text-red-700">{paymentError}</p>
                                        </div>
                                    ) : (clientSecret && stripePromise) ? (
                                        <Elements
                                            key={clientSecret}
                                            stripe={stripePromise}
                                            options={{ clientSecret, locale: 'fr', appearance: { theme: 'stripe' } }}
                                        >
                                            <StripeForm
                                                formData={formData}
                                                total={Math.round(totalWithShipping * 100)}
                                                subtotal={total}
                                                shipping={shipping}
                                                tax={0}
                                                shippingRateId={selectedRate?.id}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="rounded-[28px] bg-white/80 p-12 text-center border border-cacao-900/10">
                                            <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-sm text-cacao-700">Initialisation du paiement sécurisé...</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-10 shadow-sm text-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 mx-auto mb-6" />
                                        <h3 className="text-xl font-display text-jungle-950 mb-4">Payer avec PayPal</h3>
                                        <p className="text-sm text-cacao-700 mb-6 max-w-sm mx-auto">
                                            Vous allez être redirigé vers PayPal pour autoriser le paiement, puis revenir automatiquement.
                                        </p>
                                        <PayPalButton
                                            amountInCents={Math.round(totalWithShipping * 100)}
                                            currency="EUR"
                                            disabled={!isCheckoutDataValid || isFinalizingPayPal}
                                            onApproved={handlePayPalApproved}
                                            onError={handlePayPalError}
                                        />
                                        {isFinalizingPayPal && (
                                            <p className="text-sm text-cacao-700 mt-4">Validation du paiement en cours...</p>
                                        )}
                                        {paypalError && (
                                            <p className="text-sm text-red-600 mt-4">{paypalError}</p>
                                        )}
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
                                                    <span className={shipping === 0 ? "text-gold-600 font-bold" : "font-semibold"}>
                                                        {shipping === 0 ? 'Gratuite' : fmt.format(shipping)}
                                                    </span>
                                                </div>
                                                {originalShipping > 0 && (
                                                    <div className="flex justify-between text-xs -mt-1">
                                                        <span className="text-cacao-500">Remise lancement livraison</span>
                                                        <span className="font-semibold text-gold-700">- {fmt.format(shippingDiscount)}</span>
                                                    </div>
                                                )}
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
