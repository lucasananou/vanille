'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, total } = useCart();
    const isEmpty = items.length === 0;
    const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    // Mock constants for progress bar
    const FREE_SHIPPING_THRESHOLD = 80;
    const subtotal = total / 100;
    const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    const missingForFree = FREE_SHIPPING_THRESHOLD - subtotal;

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-cacao-900 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden" style={{ backgroundColor: '#0a2c1d' }}>
                    <div className="absolute inset-0 shine grain" aria-hidden="true"></div>
                    <div className="relative mx-auto max-w-7xl px-4 py-10 lg:py-16">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-vanilla-50 border border-vanilla-100/15">
                                    <span className="iconify text-gold-500" data-icon="mdi:check-decagram-outline"></span>
                                    <span className="text-sm font-semibold italic">Dernière étape avant le goût.</span>
                                </div>
                                <h1 className="mt-6 font-display text-4xl sm:text-5xl italic text-vanilla-50 leading-[1.06]">
                                    Votre panier
                                </h1>
                                <p className="mt-3 text-lg text-vanilla-100/75 max-w-2xl">
                                    Ajustez les quantités, puis finalisez. <span className="text-vanilla-50 font-semibold italic underline decoration-gold-500 underline-offset-4">Astuce</span> : un tube cadeau + une longueur supérieure = effet “wow” garanti.
                                </p>
                            </div>

                            {/* Free shipping progress */}
                            {!isEmpty && (
                                <div className="rounded-3xl glass p-6 w-full lg:w-[420px] text-vanilla-50 border border-vanilla-100/15">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold">Objectif livraison offerte</p>
                                        <p className="text-xs text-vanilla-100/70">
                                            {subtotal >= FREE_SHIPPING_THRESHOLD ? "Seuil atteint !" : `Encore ${fmt.format(missingForFree)}`}
                                        </p>
                                    </div>
                                    <div className="mt-3 h-2 rounded-full bg-vanilla-50/10 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-700"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-3 text-xs text-vanilla-100/60 leading-relaxed italic">
                                        Paramètre marketing : seuil “livraison offerte” configurable.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-10 lg:py-16">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* LEFT: ITEMS */}
                        <section className="lg:col-span-8">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="font-display text-3xl italic">Articles</h2>
                                {!isEmpty && (
                                    <button
                                        onClick={clearCart}
                                        className="text-sm font-bold uppercase tracking-widest text-cacao-600 hover:text-cacao-900 transition-colors border-b-2 border-transparent hover:border-gold-500 pb-1"
                                    >
                                        Vider le panier
                                    </button>
                                )}
                            </div>

                            {isEmpty ? (
                                <div className="mt-8 rounded-[32px] bg-white border border-cacao-900/5 p-10 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-vanilla-100 border border-cacao-900/10 grid place-items-center mx-auto mb-6 text-gold-500">
                                        <svg className="w-8 h-8" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                    </div>
                                    <h3 className="font-display text-2xl italic">Votre panier est vide</h3>
                                    <p className="mt-3 text-cacao-600">Choisissez une longueur, un grade, et repartez avec une vanille premium.</p>
                                    <Link
                                        href="/shop"
                                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-jungle-900 px-8 py-3.5 text-sm font-bold text-vanilla-50 hover:bg-jungle-800 transition-all shadow-none"
                                    >
                                        Aller à la boutique
                                        <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-8 space-y-6">
                                    {items.map((item) => (
                                        <article key={item.id} className="rounded-[32px] bg-white border border-cacao-900/5 p-6 hover:border-gold-500/20 transition-all group relative overflow-hidden shadow-none">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                                    <div className="w-24 h-24 rounded-[24px] bg-vanilla-50 border border-cacao-900/10 overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                                                        <img
                                                            src={item.product.images[0]}
                                                            alt={item.product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="font-display text-xl text-jungle-950 truncate">{item.product.title}</h3>
                                                        <p className="mt-1 text-sm font-bold tracking-tight text-gold-600">
                                                            {fmt.format(item.price / 100)} <span className="text-[10px] uppercase font-bold text-cacao-400">/ unité</span>
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-vanilla-100 border border-cacao-900/5 text-[10px] font-bold uppercase tracking-widest text-jungle-800 shadow-none">
                                                                <span className="w-1 h-1 rounded-full bg-gold-600"></span>
                                                                Sélection premium
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-t-0 border-cacao-900/5 pt-5 sm:pt-0">
                                                    {/* Qty control */}
                                                    <div className="inline-flex items-center rounded-full bg-vanilla-50 border border-cacao-900/10 p-1 shadow-none">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-9 h-9 rounded-full grid place-items-center hover:bg-white hover:text-gold-600 transition-all font-bold"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-4 text-sm font-bold text-jungle-900 min-w-[3ch] text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-9 h-9 rounded-full grid place-items-center hover:bg-white hover:text-gold-600 transition-all font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="text-right min-w-[100px]">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-cacao-400">Total</p>
                                                        <p className="text-xl font-display text-jungle-950">{fmt.format((item.price / 100) * item.quantity)}</p>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-10 h-10 rounded-full grid place-items-center hover:bg-red-50 text-cacao-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                                        aria-label="Supprimer"
                                                    >
                                                        <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}

                                    {/* Upsell box */}
                                    <div className="mt-12 rounded-[32px] bg-gradient-to-br from-white to-vanilla-50 border border-cacao-900/5 p-8 relative overflow-hidden shadow-none">
                                        <div className="relative z-10">
                                            <p className="text-sm font-bold uppercase tracking-widest text-gold-600">Le saviez-vous ?</p>
                                            <div className="mt-4 grid sm:grid-cols-2 gap-8 text-sm">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0">
                                                        <svg className="w-5 h-5 text-gold-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.82-8.82 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                                    </div>
                                                    <p className="text-cacao-700 leading-relaxed font-medium italic">
                                                        Découvrez nos tubes cadeaux premium pour une conservation optimale et un style unique.
                                                    </p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gold-100 border border-gold-200 flex items-center justify-center shrink-0">
                                                        <svg className="w-5 h-5 text-gold-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 7a7 7 0 0 1-7 7c-1 0-1.83-.1-2.61-.3C12.6 18.2 11.5 19.3 11 20z" /><path d="M11 20A7 7 0 0 1 4 13c0-2.5 1-4.5 3-7 2 2.5 3.5 3 7 4.1" /></svg>
                                                    </div>
                                                    <p className="text-cacao-700 leading-relaxed font-medium italic">
                                                        Anti-gaspi : une gousse épuisée peut encore parfumer votre bocal de sucre pendant des mois.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* RIGHT: SUMMARY */}
                        <aside className="lg:col-span-4">
                            <div className="lg:sticky lg:top-24 space-y-6">
                                <div className="rounded-[40px] bg-jungle-900 p-8 text-vanilla-50 relative overflow-hidden shadow-none border border-vanilla-100/10">
                                    <div className="absolute inset-0 shine opacity-50 pointer-events-none"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-display text-2xl italic">Récapitulatif</h3>
                                            <div className="w-8 h-8 rounded-full bg-vanilla-50/10 border border-vanilla-100/15 grid place-items-center">
                                                <svg className="w-4 h-4 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                            </div>
                                        </div>

                                        <div className="mt-10 space-y-4 text-sm font-medium">
                                            <div className="flex items-center justify-between border-b border-vanilla-100/5 pb-4">
                                                <p className="text-vanilla-100/60 uppercase tracking-widest text-[10px] font-bold">Produits</p>
                                                <p className="font-bold">{fmt.format(subtotal)}</p>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-vanilla-100/5 pb-4">
                                                <p className="text-vanilla-100/60 uppercase tracking-widest text-[10px] font-bold">Livraison</p>
                                                <p className="italic text-vanilla-100/50">A l'étape suivante</p>
                                            </div>
                                            <div className="pt-4 flex items-center justify-between">
                                                <p className="text-xl italic font-display">Total estimé</p>
                                                <p className="text-3xl font-display text-gold-500">{fmt.format(subtotal)}</p>
                                            </div>
                                        </div>

                                        <Link
                                            href="/checkout"
                                            className="mt-10 w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-4 text-sm font-bold text-jungle-900 hover:opacity-90 transition-all hover:scale-[1.02] uppercase tracking-widest shadow-none"
                                        >
                                            Passer au paiement
                                            <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        </Link>

                                        <div className="mt-6 flex items-center justify-center gap-4 text-vanilla-100/30 text-2xl">
                                            <svg className="w-8 h-8" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Anti-abandon Check */}
                                <div className="rounded-[32px] bg-vanilla-100/50 border border-cacao-900/5 p-6 shadow-none">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-jungle-900">Engagement Qualité</h4>
                                    <ul className="mt-4 space-y-3 text-[13px] text-cacao-700 font-medium italic">
                                        <li className="flex gap-2">
                                            <svg className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            Panier sauvegardé automatiquement
                                        </li>
                                        <li className="flex gap-2">
                                            <svg className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            Paiement 100% sécurisé
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Mobile sticky CTA */}
            {!isEmpty && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-t border-cacao-900/5 p-4 safe-area-pb shadow-none">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-cacao-400">Total estimé</p>
                            <p className="text-xl font-display text-jungle-950 leading-none mt-0.5">{fmt.format(subtotal)}</p>
                        </div>
                        <Link
                            href="/checkout"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-900 px-8 py-3.5 text-sm font-bold text-vanilla-50 uppercase tracking-widest transition-all shadow-none"
                        >
                            Payer
                            <svg className="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
