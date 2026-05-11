'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminCustomersApi } from '@/lib/api/admin-customers';

type CustomerOrder = {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
};

type CustomerAddress = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    address1: string;
    address2?: string | null;
    city: string;
    postalCode: string;
    province?: string | null;
    country: string;
    phone?: string | null;
};

type CustomerDetail = {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    createdAt: string;
    orders: CustomerOrder[];
    addresses: CustomerAddress[];
    _count?: {
        orders: number;
        reviews: number;
        wishlistItems: number;
    };
};

const formatPrice = (amountInCents: number) =>
    (amountInCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        PENDING: 'En attente',
        PAID: 'Payée',
        PROCESSING: 'En préparation',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée',
        REFUNDED: 'Remboursée',
    };

    return labels[status] || status;
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-blue-100 text-blue-800',
        PROCESSING: 'bg-indigo-100 text-indigo-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-emerald-100 text-emerald-800',
        CANCELLED: 'bg-red-100 text-red-800',
        REFUNDED: 'bg-zinc-200 text-zinc-800',
    };

    return colors[status] || 'bg-zinc-100 text-zinc-800';
};

export default function AdminCustomerDetailPage() {
    const params = useParams<{ id: string }>();
    const { token } = useAdminAuth();
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!token || !params?.id) return;

            try {
                const data = await adminCustomersApi.getCustomerById(params.id, token);
                setCustomer(data as CustomerDetail);
            } catch (err) {
                console.error('Failed to fetch customer:', err);
                setError('Impossible de charger ce client.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomer();
    }, [params?.id, token]);

    if (isLoading) {
        return <div className="p-8 text-zinc-500">Chargement du profil client...</div>;
    }

    if (error || !customer) {
        return (
            <div className="p-8">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    {error || 'Client introuvable.'}
                </div>
                <Link href="/admin/customers" className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    ← Retour aux clients
                </Link>
            </div>
        );
    }

    const displayName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || 'Client sans nom';

    return (
        <div className="space-y-6 p-8">
            <div>
                <Link href="/admin/customers" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-3">
                    ← Retour aux clients
                </Link>
                <h1 className="text-3xl font-bold text-zinc-900">{displayName}</h1>
                <p className="mt-1 text-zinc-500">
                    Client créé le {new Date(customer.createdAt).toLocaleString('fr-FR')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Informations client</h2>
                        <div className="space-y-2 text-sm text-zinc-700">
                            <p><span className="font-medium text-zinc-900">Email :</span> {customer.email}</p>
                            <p><span className="font-medium text-zinc-900">Prénom :</span> {customer.firstName || '-'}</p>
                            <p><span className="font-medium text-zinc-900">Nom :</span> {customer.lastName || '-'}</p>
                            <p><span className="font-medium text-zinc-900">ID client :</span> {customer.id}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Adresses enregistrées</h2>
                        {customer.addresses.length === 0 ? (
                            <p className="text-sm text-zinc-500">Aucune adresse enregistrée pour ce client.</p>
                        ) : (
                            <div className="space-y-4">
                                {customer.addresses.map((address) => (
                                    <div key={address.id} className="rounded-lg border border-zinc-100 p-4 text-sm text-zinc-700">
                                        <p className="font-medium text-zinc-900">
                                            {[address.firstName, address.lastName].filter(Boolean).join(' ') || displayName}
                                        </p>
                                        <p>{address.address1}</p>
                                        {address.address2 && <p>{address.address2}</p>}
                                        <p>{address.postalCode} {address.city}</p>
                                        {address.province && <p>{address.province}</p>}
                                        <p>{address.country}</p>
                                        {address.phone && <p>Tél : {address.phone}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Dernières commandes</h2>
                        {customer.orders.length === 0 ? (
                            <p className="text-sm text-zinc-500">Ce client n’a pas encore passé de commande.</p>
                        ) : (
                            <div className="space-y-3">
                                {customer.orders.map((order) => (
                                    <div key={order.id} className="flex flex-col gap-3 rounded-lg border border-zinc-100 p-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-medium text-zinc-900">#{order.orderNumber}</p>
                                            <p className="text-sm text-zinc-500">
                                                {new Date(order.createdAt).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                            <span className="text-sm font-semibold text-zinc-900">{formatPrice(order.total)}</span>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                            >
                                                Voir la commande
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Résumé</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Commandes</span>
                                <span className="font-semibold text-zinc-900">{customer._count?.orders || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Avis</span>
                                <span className="font-semibold text-zinc-900">{customer._count?.reviews || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Wishlist</span>
                                <span className="font-semibold text-zinc-900">{customer._count?.wishlistItems || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
