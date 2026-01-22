'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ordersApi } from '@/lib/api/orders';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CheckoutFormContentProps {
    initialData: any;
    cartItems: any[];
    cartTotal: number;
    shippingCost: number;
    tax: number;
}

export default function CheckoutFormContent({
    initialData,
    cartItems,
    cartTotal,
    shippingCost,
    tax
}: CheckoutFormContentProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { clearCart } = useCart();
    const { customer } = useAuth(); // Assuming useAuth is available or passed as prop

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(initialData);

    const orderTotal = cartTotal + shippingCost + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create the Order in Backend
            const orderData = {
                email: formData.email,
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address1: formData.address1,
                    address2: formData.address2 || undefined,
                    city: formData.city,
                    province: formData.province || undefined,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    phone: formData.phone || undefined,
                },
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingCost,
                tax,
            };

            // Capture order creation to associate with payment if possible, or just create it.
            const order = await ordersApi.createOrder(orderData, customer?.id);

            // 2. Confirm Payment with Stripe
            const { error: stripeError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${order.id}`,
                    payment_method_data: {
                        billing_details: {
                            name: `${formData.firstName} ${formData.lastName}`,
                            email: formData.email,
                            phone: formData.phone,
                            address: {
                                city: formData.city,
                                country: formData.country,
                                line1: formData.address1,
                                line2: formData.address2,
                                postal_code: formData.postalCode,
                                state: formData.province,
                            },
                        },
                    },
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            clearCart();

        } catch (err: any) {
            console.error('Checkout failed:', err);
            setError(err.message || 'Le paiement a échoué. Veuillez vérifier vos informations.');
            setIsProcessing(false);
        }
    };

    // Countdown Timer Logic
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-8 pb-32 lg:pb-8">
            {/* Steps & Timer */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="flex items-center text-sm font-medium mb-4">
                    <div className="flex items-center text-green-600">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 mr-2">✓</span>
                        Panier
                    </div>
                    <div className="w-12 h-[1px] bg-zinc-200 mx-2"></div>
                    <div className="flex items-center text-zinc-900">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white mr-2">2</span>
                        Livraison
                    </div>
                    <div className="w-12 h-[1px] bg-zinc-200 mx-2"></div>
                    <div className="flex items-center text-zinc-900">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-white mr-2">3</span>
                        Paiement
                    </div>
                </div>
                <div className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors duration-500" style={{ backgroundColor: timeLeft < 60 ? '#fef2f2' : undefined, color: timeLeft < 60 ? '#991b1b' : undefined }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Votre commande est réservée pendant <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span> minutes</span>
                </div>
            </div>

            <h1 className="text-3xl font-serif text-center text-zinc-900 mb-8">Paiement Sécurisé</h1>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Main Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
                    {/* Contact Information */}
                    <div className="bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
                        <h2 className="text-lg font-medium text-zinc-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center">1</span>
                            Informations de contact
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
                                    placeholder="vous@exemple.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Téléphone (pour le suivi de livraison)
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                    placeholder="06 12 34 56 78"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
                        <h2 className="text-lg font-medium text-zinc-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center">2</span>
                            Adresse de livraison
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="address1" className="block text-sm font-medium text-zinc-700 mb-2">
                                Adresse *
                            </label>
                            <input
                                id="address1"
                                name="address1"
                                type="text"
                                autoComplete="street-address"
                                required
                                value={formData.address1}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                placeholder="12 rue Victor Hugo"
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="address2" className="block text-sm font-medium text-zinc-700 mb-2">
                                Appartement, suite, etc. (optionnel)
                            </label>
                            <input
                                id="address2"
                                name="address2"
                                type="text"
                                autoComplete="address-line2"
                                value={formData.address2}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Code Postal *
                                </label>
                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    autoComplete="postal-code"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                    placeholder="75001"
                                />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-zinc-700 mb-2">
                                    Ville *
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900"
                                    placeholder="Paris"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="country" className="block text-sm font-medium text-zinc-700 mb-2">
                                Pays *
                            </label>
                            <select
                                id="country"
                                name="country"
                                required
                                autoComplete="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 bg-white"
                            >
                                <option value="FR">France</option>
                                <option value="BE">Belgique</option>
                                <option value="CH">Suisse</option>
                                <option value="CA">Canada</option>
                                <option value="US">États-Unis</option>
                            </select>
                            {formData.country !== 'FR' && (
                                <p className="text-xs text-amber-600 mt-1">Des frais de douane peuvent s&apos;appliquer hors UE.</p>
                            )}
                        </div>
                    </div>

                    {/* Stripe Payment Element */}
                    <div className="bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
                        <h2 className="text-lg font-medium text-zinc-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs flex items-center justify-center">3</span>
                            Paiement
                        </h2>
                        {/* The Stripe Element automatically renders Card Number, Expiry, CVC etc. */}
                        <PaymentElement options={{ layout: 'tabs' }} />
                    </div>

                    <button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="w-full bg-zinc-900 py-4 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-lg hidden lg:block"
                    >
                        {isProcessing ? 'Traitement...' : `Payer ${orderTotal ? (orderTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : ''}`}
                    </button>

                    {/* Trust Icons Block */}
                    <div className="bg-zinc-50 p-4 rounded-lg flex flex-wrap justify-center gap-6 text-xs text-zinc-500 border border-zinc-200/50">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔒</span>
                            <span className="font-medium">Paiement 100% sécurisé</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🚚</span>
                            <span className="font-medium">Expédié sous 24h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">↩️</span>
                            <span className="font-medium">Retours sous 30j</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">💬</span>
                            <span className="font-medium">Support réactif</span>
                        </div>
                    </div>

                    {/* Mobile Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden z-50">
                        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500">Total à payer</span>
                                <span className="font-bold text-zinc-900 text-lg">{(orderTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                            </div>
                            <button
                                type="submit"
                                disabled={!stripe || isProcessing}
                                onClick={handleSubmit}
                                className="flex-1 bg-zinc-900 py-3 text-sm font-medium uppercase tracking-widest text-white rounded-lg transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed shadow-md"
                            >
                                {isProcessing ? '...' : 'Payer maintenant'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="rounded-lg border border-zinc-200 p-6 bg-white shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-zinc-900">Récapitulatif</h2>
                                <a href="/cart" className="text-xs text-zinc-500 underline hover:text-zinc-900">Modifier</a>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 group relative">
                                        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-zinc-100 rounded-sm">
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-zinc-400 text-xs">Img</div>
                                            )}
                                            <div className="absolute top-0 right-0 bg-zinc-900 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-bl-sm font-bold">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-zinc-900 line-clamp-2">{item.product.title}</p>
                                            {item.variant && <p className="text-xs text-zinc-500">{item.variant.title}</p>}
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900">
                                            {((item.price / 100) * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 border-t border-zinc-100 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Sous-total</span>
                                    <span className="font-medium text-zinc-900">{(cartTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-700">
                                    <span className="font-medium">Livraison</span>
                                    <span className="font-medium">{shippingCost === 0 ? 'Offerte' : (shippingCost / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                </div>
                                {shippingCost > 0 && <span className="text-[10px] text-zinc-400 block -mt-2">Expédition rapide via Colissimo</span>}

                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">TVA (inclus)</span>
                                    <span className="text-zinc-500">{(tax / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                </div>

                                <div className="flex justify-between border-t border-zinc-100 pt-3 items-end">
                                    <div>
                                        <span className="text-base font-bold text-zinc-900 block">Total</span>
                                        <span className="text-[10px] text-zinc-400 font-normal">TVA incluse</span>
                                    </div>
                                    <span className="text-xl font-bold text-zinc-900">{(orderTotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reassurance Sidebar Block */}
                        <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-100">
                            <p className="text-sm font-medium text-zinc-900 mb-2">Pourquoi nous faire confiance ?</p>
                            <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-4">
                                <li>Site français basé à Paris</li>
                                <li>Service client disponible 7j/7</li>
                                <li>Paiement crypté SSL</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
