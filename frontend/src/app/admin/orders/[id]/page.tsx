'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminOrdersApi } from '@/lib/api/admin-orders';
import type { Order } from '@/lib/types';

const ORDER_STATUS_OPTIONS = [
    { value: 'PENDING', label: 'En attente' },
    { value: 'PAID', label: 'Payée' },
    { value: 'PROCESSING', label: 'En préparation' },
    { value: 'SHIPPED', label: 'Expédiée' },
    { value: 'DELIVERED', label: 'Livrée' },
    { value: 'CANCELLED', label: 'Annulée' },
] as const;

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-blue-100 text-blue-800',
        PROCESSING: 'bg-indigo-100 text-indigo-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-zinc-100 text-zinc-800';
};

const formatPrice = (amountInCents: number) =>
    (amountInCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default function AdminOrderDetailPage() {
    const params = useParams<{ id: string }>();
    const { token } = useAdminAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !params?.id) return;

            try {
                const data = await adminOrdersApi.getOrderById(params.id, token);
                setOrder(data);
                setSelectedStatus(data.status);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Impossible de charger cette commande.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [params?.id, token]);

    const handleStatusUpdate = async () => {
        if (!token || !order || selectedStatus === order.status) return;

        setIsSaving(true);
        setError('');

        try {
            const updatedOrder = await adminOrdersApi.updateOrderStatus(order.id, selectedStatus, token);
            setOrder(updatedOrder);
            setSelectedStatus(updatedOrder.status);
        } catch (err) {
            console.error('Failed to update order status:', err);
            setError('Impossible de mettre à jour le statut de la commande.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-zinc-500">Chargement de la commande...</div>;
    }

    if (error || !order) {
        return (
            <div className="p-8">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    {error || 'Commande introuvable.'}
                </div>
                <Link href="/admin/orders" className="inline-flex mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    ← Retour aux commandes
                </Link>
            </div>
        );
    }

    const shippingAddress = order.shippingAddress;

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <Link href="/admin/orders" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-3">
                        ← Retour aux commandes
                    </Link>
                    <h1 className="text-3xl font-bold text-zinc-900">Commande #{order.orderNumber}</h1>
                    <p className="mt-1 text-zinc-500">
                        Créée le {new Date(order.createdAt).toLocaleString('fr-FR')}
                    </p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 min-w-[280px]">
                    <div className="flex items-center justify-between gap-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                            {ORDER_STATUS_OPTIONS.find((option) => option.value === order.status)?.label || order.status}
                        </span>
                        <span className="text-lg font-bold text-zinc-900">{formatPrice(order.total)}</span>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {ORDER_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleStatusUpdate}
                            disabled={isSaving || selectedStatus === order.status}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                        >
                            {isSaving ? 'Enregistrement...' : 'Mettre à jour'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Articles commandés</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 rounded-lg border border-zinc-100 p-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-100 shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-zinc-900">{item.product?.title || 'Produit'}</p>
                                        <p className="text-sm text-zinc-500">Quantité : {item.quantity}</p>
                                        <p className="text-sm text-zinc-500">Prix unitaire : {formatPrice(item.price)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-zinc-900">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Adresse de livraison</h2>
                        <div className="text-sm text-zinc-700 leading-7">
                            <p className="font-medium text-zinc-900">
                                {shippingAddress.firstName} {shippingAddress.lastName}
                            </p>
                            <p>{shippingAddress.address1}</p>
                            {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                            <p>
                                {shippingAddress.postalCode} {shippingAddress.city}
                            </p>
                            {shippingAddress.province && <p>{shippingAddress.province}</p>}
                            <p>{shippingAddress.country}</p>
                            {shippingAddress.phone && <p>Tél : {shippingAddress.phone}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Client</h2>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p className="font-medium text-zinc-900">
                                {order.customer?.firstName || shippingAddress.firstName} {order.customer?.lastName || shippingAddress.lastName}
                            </p>
                            <p>{order.email}</p>
                            {order.customer?.id && <p>ID client : {order.customer.id}</p>}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Résumé financier</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Sous-total</span>
                                <span className="font-medium text-zinc-900">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Livraison</span>
                                <span className="font-medium text-zinc-900">{formatPrice(order.shippingCost)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Taxes</span>
                                <span className="font-medium text-zinc-900">{formatPrice(order.tax)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
                                <span className="font-semibold text-zinc-900">Total</span>
                                <span className="text-lg font-bold text-zinc-900">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
