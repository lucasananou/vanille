'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/lib/types';
import { trackPurchase } from '@/lib/analytics';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';

export default function OrderConfirmationPage() {
    const { locale } = useLocale();
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
                setError(locale === 'en' ? 'Unable to load order details' : 'Impossible de charger les détails de la commande');
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, locale]);

    useEffect(() => {
        if (!order) return;
        if (typeof window !== 'undefined') {
            const key = `purchase_tracked_${order.id}`;
            if (sessionStorage.getItem(key) === 'true') return;
            sessionStorage.setItem(key, 'true');
        }
        trackPurchase(order);
    }, [order]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-zinc-500">{locale === 'en' ? 'Loading your order...' : 'Chargement de la commande...'}</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white">
                <nav className="border-b border-zinc-100">
                    <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
                        <Link href={withLocale('/', locale)} className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-amber-700 transition-colors">
                            M.S.V-NOSY BE
                        </Link>
                    </div>
                </nav>
                <div className="mx-auto max-w-7xl px-6 py-24 text-center">
                    <p className="text-red-600">{error || (locale === 'en' ? 'Order not found' : 'Commande non trouvée')}</p>
                    <Link href={withLocale('/', locale)} className="mt-4 inline-block text-amber-700 hover:text-amber-800">
                        {locale === 'en' ? 'Back to home' : 'Retour à l&apos;accueil'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center px-6 gap-3">
                    <Link href={withLocale('/', locale)} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                            <img
                                src="/logo_msv.png"
                                alt="Logo MSV Nosy-Be"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-xl font-medium tracking-tight text-zinc-900 uppercase">
                            M.S.V-NOSY BE
                        </span>
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
                    <h1 className="text-3xl font-medium text-zinc-900 mb-2">{locale === 'en' ? 'Order confirmed!' : 'Commande confirmée !'}</h1>
                    <p className="text-zinc-600">{locale === 'en' ? 'Thank you for your purchase' : 'Merci pour votre achat'}</p>
                </div>

                {/* Order Details */}
                <div className="rounded-lg border border-zinc-200 p-6 mb-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">{locale === 'en' ? 'Order number' : 'N° de commande'}</p>
                            <p className="text-zinc-900">{order.orderNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">{locale === 'en' ? 'Order date' : 'Date de commande'}</p>
                            <p className="text-zinc-900">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">{locale === 'en' ? 'Status' : 'Statut'}</p>
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                {order.status === 'PENDING' ? (locale === 'en' ? 'Pending' : 'En attente') :
                                    order.status === 'PAID' ? (locale === 'en' ? 'Paid' : 'Payée') :
                                        order.status === 'PROCESSING' ? (locale === 'en' ? 'Processing' : 'En préparation') :
                                            order.status === 'SHIPPED' ? (locale === 'en' ? 'Shipped' : 'Expédiée') :
                                                order.status === 'DELIVERED' ? (locale === 'en' ? 'Delivered' : 'Livrée') :
                                                order.status === 'CANCELLED' ? (locale === 'en' ? 'Cancelled' : 'Annulée') :
                                                    order.status === 'REFUNDED' ? (locale === 'en' ? 'Refunded' : 'Remboursée') : order.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-700 mb-1">{locale === 'en' ? 'Total' : 'Total'}</p>
                            <p className="text-lg font-medium text-zinc-900">
                                {(order.total / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t border-zinc-200 pt-6">
                        <p className="text-sm font-medium text-zinc-700 mb-2">{locale === 'en' ? 'Shipping address' : 'Adresse de livraison'}</p>
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
                    <h2 className="text-lg font-medium text-zinc-900 mb-4">{locale === 'en' ? 'Items ordered' : 'Articles commandés'}</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                    <p className="font-medium text-zinc-900">{item.product.title}</p>
                                    <p className="text-zinc-500">{locale === 'en' ? 'Quantity:' : 'Quantité :'} {item.quantity}</p>
                                </div>
                                <p className="font-medium text-zinc-900">
                                    {((item.price / 100) * item.quantity).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-zinc-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">{locale === 'en' ? 'Subtotal' : 'Sous-total'}</span>
                            <span className="text-zinc-900">{(order.subtotal / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">{locale === 'en' ? 'Shipping' : 'Livraison'}</span>
                            <span className="text-zinc-900">{(order.shippingCost / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-600">{locale === 'en' ? 'Taxes' : 'Taxes'}</span>
                            <span className="text-zinc-900">{(order.tax / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                        <div className="flex justify-between border-t border-zinc-200 pt-2">
                            <span className="font-medium text-zinc-900">{locale === 'en' ? 'Total' : 'Total'}</span>
                            <span className="text-lg font-medium text-zinc-900">
                                {(order.total / 100).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: 'EUR' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href={withLocale('/', locale)}
                        className="flex-1 bg-zinc-900 py-3 text-center text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800"
                    >
                        {locale === 'en' ? 'Continue shopping' : 'Continuer mes achats'}
                    </Link>
                    <Link
                        href={withLocale('/account', locale)}
                        className="flex-1 border border-zinc-900 py-3 text-center text-sm font-medium uppercase tracking-widest text-zinc-900 transition hover:bg-zinc-50"
                    >
                        {locale === 'en' ? 'View my orders' : 'Voir mes commandes'}
                    </Link>
                </div>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    {locale === 'en' ? <>A confirmation email has been sent to <strong>{order.email}</strong></> : <>Un email de confirmation a été envoyé à <strong>{order.email}</strong></>}
                </p>
            </div>
        </div>
    );
}
