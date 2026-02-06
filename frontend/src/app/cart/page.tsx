'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

const CartIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-6.43H5.91" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
    </svg>
);

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, total } = useCart();
    const isEmpty = items.length === 0;
    const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                <section className="relative overflow-hidden py-10 lg:py-16">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="mx-auto max-w-7xl px-4 relative">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <h1 className="font-display text-4xl sm:text-5xl italic">Mon Panier</h1>
                                <p className="text-vanilla-100/70 mt-3 text-lg">Vérifiez vos articles avant la dégustation.</p>
                            </div>
                            {!isEmpty && (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={clearCart}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-vanilla-100/10 px-5 py-2.5 text-sm font-semibold hover:bg-vanilla-50/10 transition-all"
                                    >
                                        Vider
                                    </button>
                                    <Link
                                        href="/checkout"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-bold text-jungle-900 hover:opacity-90 transition-all font-bold"
                                    >
                                        Finaliser la commande
                                    </Link>
                                </div>
                            )}
                        </div>

                        {isEmpty ? (
                            <div className="mt-12 p-12 rounded-3xl glass border border-vanilla-100/10 text-center">
                                <div className="w-20 h-20 rounded-full bg-vanilla-50/5 border border-vanilla-100/10 grid place-items-center mx-auto mb-6 text-gold-500">
                                    <CartIcon />
                                </div>
                                <h2 className="font-display text-2xl text-white">Votre panier est vide</h2>
                                <p className="text-vanilla-100/60 mt-3">Laissez-vous tenter par nos gousses de vanille d'exception.</p>
                                <Link
                                    href="/"
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-8 py-3 text-sm font-bold text-jungle-900 hover:opacity-90 transition-all font-bold"
                                >
                                    Découvrir la collection
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-12 space-y-6">
                                <div className="grid gap-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 rounded-3xl glass border border-vanilla-100/10 hover:border-vanilla-100/20 transition-all group">
                                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className="w-24 h-24 rounded-2xl bg-vanilla-50/5 border border-vanilla-100/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                                                        <div className="text-gold-500">
                                                            <svg className="w-10 h-10" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-display text-2xl truncate text-white">{item.product.title}</p>
                                                        {item.variant && (
                                                            <p className="text-sm text-vanilla-100/60 mt-1">
                                                                Edition : <span className="text-vanilla-100">{item.variant.title}</span>
                                                            </p>
                                                        )}
                                                        <p className="text-sm font-semibold text-gold-500 mt-2">
                                                            {fmt.format(item.price / 100)} / unité
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 border-vanilla-100/10 pt-6 md:pt-0">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center rounded-2xl bg-vanilla-50/5 border border-vanilla-100/10 overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-10 h-10 flex items-center justify-center hover:bg-vanilla-50/10 transition-colors text-lg"
                                                            >
                                                                −
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                                className="w-12 bg-transparent text-center text-sm font-bold focus:outline-none"
                                                            />
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-10 h-10 flex items-center justify-center hover:bg-vanilla-50/10 transition-colors text-lg"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="text-right min-w-[120px]">
                                                        <p className="text-2xl font-display text-white">
                                                            {fmt.format((item.price / 100) * item.quantity)}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-3 rounded-2xl hover:bg-red-500/10 text-vanilla-100/40 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                                        aria-label="Supprimer"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 rounded-3xl glass border border-vanilla-100/10 flex flex-col sm:flex-row items-center justify-between gap-8">
                                    <div className="text-center sm:text-left">
                                        <p className="text-vanilla-100/40 text-xs uppercase tracking-widest font-bold">Total Estimé</p>
                                        <p className="text-4xl sm:text-5xl font-display mt-2 text-transparent bg-clip-text bg-gradient-to-r from-gold-500 back to-vanilla-100">{fmt.format(total / 100)}</p>
                                        <p className="text-vanilla-100/40 text-xs mt-2">Livraison offerte dès 80€ d'achat.</p>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-12 py-5 text-lg font-bold text-jungle-900 hover:opacity-90 transition-all hover:scale-[1.02]"
                                    >
                                        Commander maintenant
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
