'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

const CloseIcon = () => (
    <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
);

const MinusIcon = () => (
    <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
);

const PlusIcon = () => (
    <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const CartIcon = () => (
    <svg className="w-6 h-6 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export default function CartDrawer() {
    const { items, total, isCartOpen, closeCart, removeItem, updateQuantity } = useCart();

    const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-obsidian/60 transition-opacity duration-300 opacity-100"
                onClick={closeCart}
            />

            {/* Drawer */}
            <aside
                className="absolute right-0 top-0 bottom-0 w-[92%] max-w-md transform transition-transform duration-300 ease-in-out bg-jungle-900 border-l border-vanilla-100/10 text-vanilla-50 translate-x-0"
            >
                <div className="h-full flex flex-col">
                    <div className="p-5 flex items-center justify-between border-b border-vanilla-100/10">
                        <div>
                            <p className="font-display text-xl">Votre panier</p>
                            <p className="text-xs text-vanilla-100/70">Finalisez en 2 minutes</p>
                        </div>
                        <button
                            onClick={closeCart}
                            className="w-11 h-11 rounded-2xl glass hover:bg-vanilla-50/10 transition rm-anim focus-ring flex items-center justify-center" aria-label="Fermer le panier">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto p-5 space-y-4">
                        {items.length === 0 ? (
                            <div className="rounded-xxl glass p-8 text-center">
                                <div className="inline-flex w-12 h-12 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/12 items-center justify-center">
                                    <CartIcon />
                                </div>
                                <p className="mt-4 font-semibold">Panier vide</p>
                                <p className="mt-1 text-sm text-vanilla-100/70">Ajoutez vos gousses préférées.</p>
                                <button
                                    onClick={closeCart}
                                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                                    Aller à la boutique <ArrowRightIcon />
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <article key={item.id} className="rounded-xxl glass p-4 border border-vanilla-100/10">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/12 overflow-hidden flex-shrink-0 grid place-items-center">
                                            <div className="text-gold-500">
                                                <svg className="w-8 h-8" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-semibold truncate">{item.product.title}</p>
                                                    <p className="text-sm text-vanilla-100/70">{fmt.format(item.price)} <span className="text-xs">/ unité</span></p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 rounded-xl hover:bg-vanilla-50/10 focus-ring flex items-center justify-center"
                                                    aria-label="Supprimer"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <div className="inline-flex items-center rounded-full bg-vanilla-50/8 border border-vanilla-100/12 overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-10 h-9 grid place-items-center hover:bg-vanilla-50/10 focus-ring"
                                                        aria-label="Diminuer quantité"
                                                    >
                                                        <MinusIcon />
                                                    </button>
                                                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-9 grid place-items-center hover:bg-vanilla-50/10 focus-ring"
                                                        aria-label="Augmenter quantité"
                                                    >
                                                        <PlusIcon />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-semibold">{fmt.format(item.price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    <div className="p-5 border-t border-vanilla-100/10">
                        <div className="rounded-xxl glass p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-vanilla-100/75">Sous-total</p>
                                <p className="text-lg font-semibold">{fmt.format(total)}</p>
                            </div>
                            <p className="mt-1 text-xs text-vanilla-100/60">Livraison & taxes calculées au paiement.</p>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Link
                                    href="/cart"
                                    onClick={closeCart}
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-50/10 border border-vanilla-100/12 hover:bg-vanilla-50/15 focus-ring"
                                >
                                    Voir panier <ArrowRightIcon />
                                </Link>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring"
                                >
                                    Commander <LockIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
