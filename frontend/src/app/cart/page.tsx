'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { getImageUrl } from '@/lib/utils';

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                {/* Simple Nav */}
                <nav className="border-b border-zinc-100">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                        <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-[#a1b8ff] transition-colors">
                            Tsniout
                        </Link>
                    </div>
                </nav>

                {/* Empty Cart */}
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <svg className="mx-auto h-24 w-24 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h1 className="mt-6 text-2xl font-medium text-zinc-900">Votre panier est vide</h1>
                    <p className="mt-2 text-zinc-500">Commencez vos achats pour ajouter des articles à votre panier.</p>
                    <Link
                        href="/"
                        className="mt-8 inline-flex items-center gap-2 bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Simple Nav */}
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-[#a1b8ff] transition-colors">
                        Tsniout
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
                            <h1 className="text-2xl font-medium text-zinc-900">Panier ({itemCount} article{itemCount > 1 ? 's' : ''})</h1>
                            <button
                                onClick={clearCart}
                                className="text-sm text-zinc-500 hover:text-red-600 transition"
                            >
                                Vider le panier
                            </button>
                        </div>

                        <div className="mt-8 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 border-b border-zinc-100 pb-6">
                                    {/* Product Image */}
                                    <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-zinc-100">
                                        {item.product.images?.[0] ? (
                                            <Image
                                                src={getImageUrl(item.product.images[0])}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-zinc-400 text-xs">
                                                Pas d'image
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex justify-between">
                                            <div>
                                                <Link
                                                    href={`/produit/${item.product.slug}`}
                                                    className="text-base font-medium text-zinc-900 hover:text-[#a1b8ff]"
                                                >
                                                    {item.product.title}
                                                </Link>
                                                {item.variant && (
                                                    <p className="mt-1 text-sm text-zinc-500">{item.variant.title}</p>
                                                )}
                                                <p className="mt-1 text-sm text-zinc-400">REF : {item.product.sku}</p>
                                            </div>
                                            <p className="text-base font-medium text-zinc-900">
                                                {((item.price / 100) * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </p>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="mt-4 flex items-center gap-4">
                                            <div className="flex items-center border border-zinc-200 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-zinc-100 transition"
                                                >
                                                    −
                                                </button>
                                                <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-zinc-100 transition"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-sm text-zinc-500 hover:text-red-600 transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-lg border border-zinc-200 p-6">
                            <h2 className="text-lg font-medium text-zinc-900">Récapitulatif de la commande</h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Sous-total</span>
                                    <span className="font-medium text-zinc-900">{(total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Livraison</span>
                                    <span className="text-zinc-500">Calculée à l'étape suivante</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-600">Taxes</span>
                                    <span className="text-zinc-500">Calculées à l'étape suivante</span>
                                </div>

                                <div className="border-t border-zinc-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-base font-medium text-zinc-900">Total</span>
                                        <span className="text-xl font-medium text-zinc-900">{(total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-6 w-full bg-zinc-900 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800">
                                Passer à la caisse
                            </button>

                            <Link
                                href="/"
                                className="mt-4 block text-center text-sm text-zinc-600 hover:text-zinc-900"
                            >
                                Continuer mes achats
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
