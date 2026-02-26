'use client';

import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ordersApi } from '@/lib/api/orders';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface StripeFormProps {
    formData: {
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        address: string;
        zip: string;
        city: string;
    };
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    shippingRateId?: string;
}

const LockIcon = () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function StripeForm({ formData, total, subtotal, shipping, tax, shippingRateId }: StripeFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { items, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // 1. Create order in backend first
            const orderData = {
                email: formData.email,
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address1: formData.address,
                    city: formData.city,
                    postalCode: formData.zip,
                    country: 'FR', // Defaulting to France for now
                    phone: formData.phone,
                },
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingCost: Math.round(shipping * 100),
                tax: 0,
                shippingRateId: shippingRateId,
            };

            const order = await ordersApi.createOrder(orderData);

            // 2. Confirm payment
            const { error: stripeError } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-confirmation/${order.id}`,
                    payment_method_data: {
                        billing_details: {
                            name: `${formData.firstName} ${formData.lastName}`,
                            email: formData.email,
                            phone: formData.phone,
                        },
                    },
                },
            });

            if (stripeError) {
                setErrorMessage(stripeError.message || 'Une erreur est survenue lors du paiement.');
                setIsProcessing(false);
            } else {
                // Redirect happens automatically via return_url
                clearCart();
            }
        } catch (err: any) {
            console.error('Order creation failed:', err);
            setErrorMessage(err.message || 'Impossible de créer la commande. Veuillez réessayer.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-[28px] bg-white/80 backdrop-blur border border-cacao-900/10 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <h2 className="font-display text-2xl text-jungle-950">Paiement</h2>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-vanilla-100 border border-cacao-900/10 text-cacao-700">
                        <span className="text-gold-600"><LockIcon /></span>
                        PCI / 3DS
                    </span>
                </div>

                <PaymentElement options={{ layout: 'tabs' }} />

                {errorMessage && (
                    <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        {errorMessage}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-3 rounded-full px-8 py-5 text-base font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Traitement en cours...' : `Valider & Payer — ${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(total / 100)}`}
            </button>

            <p className="text-center text-xs text-cacao-600">
                Paiement ultra-sécurisé via Stripe. Vos données bancaires ne sont jamais stockées sur nos serveurs.
            </p>
        </div>
    );
}
