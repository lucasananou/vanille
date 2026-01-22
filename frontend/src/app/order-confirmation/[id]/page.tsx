'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/lib/types';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await ordersApi.getOrderById(orderId);
                setOrder(orderData);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Impossible de charger les détails de la commande');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-zinc-500">Chargement de la commande...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white">
                <nav className="border-b border-zinc-100">
                    <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
                        <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-amber-700 transition-colors">
                            AP Collections
                        </Link>
                    </div>
                </nav>
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <p className="text-red-600">{error || 'Commande non trouvée'}</p>
                    <Link href="/" className="mt-4 inline-block text-amber-700 hover:text-amber-800">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
                    <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-amber-700 transition-colors">
                        AP Collections
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-3xl px-6 py-12">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="mx-auto mb-6 flex  h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-medium text-zinc-900 mb-2">Commande confirmée !</h1>
                    <p className="text-zinc-600">Merci pour votre achat</p>
                </div>

                {/* Order Details */}
                <div className="rounded-lg border border-zinc-200 p-6 mb-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">N° de commande</p>
                            <p className="text-zinc-900">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">Date de commande</p>
                            <p className="text-zinc-900">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">Statut</p>
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                {order.status === 'PENDING' ? 'En attente' :
                                    order.status === 'PAID' ? 'Payée' :
                                        order.status === 'PROCESSING' ? 'En cours' :
                                            order.status === 'SHIPPED' ? 'Expédiée' :
                                                order.status === 'DELIVERED' ? 'Livrée' :
                                                    order.status === 'CANCELLED' ? 'Annulée' : order.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">Total</p>
                            <p className="text-lg font-medium text-zinc-900">
                                {(order.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t border-zinc-200 pt-6">
                        <p className="text-sm font-medium text-zinc-700 mb-2">Adresse de livraison</p>
                        <p className="text-sm text-zinc-900">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                            {order.shippingAddress.address1}
                            {order.shippingAddress.address2 && <><br />{order.shippingAddress.address2}</>}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
                            {order.shippingAddress.country}
                        </p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="rounded-lg border border-zinc-200 p-6 mb-6">
                    <h2 className="text-lg font-medium text-zinc-900 mb-4">Articles commandés</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <p className="font-medium text-zinc-900">{item.product.title}</p>
                                    <p className="text-zinc-500">Quantité : {item.quantity}</p>
                                </div>
                                <p className="font-medium text-zinc-900">
                                    {((item.price / 100) * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-zinc-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">Sous-total</span>
                            <span className="text-zinc-900">{(order.subtotal / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">Livraison</span>
                            <span className="text-zinc-900">{(order.shippingCost / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">Taxes</span>
                            <span className="text-zinc-900">{(order.tax / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-200 pt-2">
                            <span className="font-medium text-zinc-900">Total</span>
                            <span className="text-lg font-medium text-zinc-900">
                                {(order.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/"
                        className="flex-1 bg-zinc-900 py-3 text-center text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800"
                    >
                        Continuer mes achats
                    </Link>
                    <Link
                        href="/account"
                        className="flex-1 border border-zinc-900 py-3 text-center text-sm font-medium uppercase tracking-widest text-zinc-900 transition hover:bg-zinc-50"
                    >
                        Voir mes commandes
                    </Link>
                </div>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Un email de confirmation a été envoyé à <strong>{order.email}</strong>
                </p>
            </div>
        </div>
    );
}
