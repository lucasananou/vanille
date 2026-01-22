'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ordersApi } from '@/lib/api/orders';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/lib/api/payments';
import CheckoutFormContent from '@/components/checkout-form-content'; // We will create this or use usage inline

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, clearCart } = useCart();
    const { customer, isAuthenticated } = useAuth();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: customer?.email || '',
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'FR',
        phone: '',
    });

    const shippingCost = 1000; // $10.00 in cents
    const tax = Math.round(total * 0.1); // 10% tax
    const orderTotal = total + shippingCost + tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // We will move the submit logic to the inner component
    // or handle it via Stripe's confirmPayment callback
    // For now, let's just setup the wrapper.
    const [clientSecret, setClientSecret] = useState('');
    const [initError, setInitError] = useState('');

    useEffect(() => {
        if (items.length > 0) {
            // Create PaymentIntent as soon as checkout loads
            // In a real app, you might update this when shipping changes
            paymentsApi.createPaymentIntent(total + 1000 + Math.round(total * 0.1)) // Total + Shipping + Tax
                .then(data => {
                    console.log('Payment Intent created:', data);
                    if (!data.clientSecret) {
                        console.error('Missing clientSecret in response');
                    }
                    setClientSecret(data.clientSecret);
                })
                .catch(err => {
                    console.error('Failed to init payment', err);
                    setInitError('Impossible d\'initialiser le paiement sécurisé. Veuillez réessayer ou contacter le support.');
                });
        }
    }, [items, total]);

    if (items.length > 0 && !clientSecret) {
        if (initError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-red-600 font-medium mb-4">{initError}</p>
                    <button onClick={() => window.location.reload()} className="underline text-zinc-900">Réessayer</button>
                    <Link href="/cart" className="mt-4 text-zinc-500 text-sm">Retour au panier</Link>
                </div>
            );
        }
        return <div className="min-h-screen flex items-center justify-center">Chargement du paiement sécurisé...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <nav className="border-b border-zinc-100">
                    <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Tsniout"
                                width={180}
                                height={60}
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>
                </nav>
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <p className="text-zinc-500">Votre panier est vide.</p>
                    <Link href="/" className="mt-4 inline-block text-[#a1b8ff] hover:text-[#8da0ef]">
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* ... keeping header ... */}
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Tsniout"
                            width={180}
                            height={60}
                            className="object-contain"
                            priority
                        />
                    </Link>

                </div>
            </nav>

            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <CheckoutFormContent
                        initialData={formData}
                        cartItems={items}
                        cartTotal={total}
                        shippingCost={shippingCost}
                        tax={tax}
                    />
                </Elements>
            )}
        </div>
    );
}
