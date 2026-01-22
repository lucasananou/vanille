'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminOrdersApi } from '@/lib/api/admin-orders';
import type { Order } from '@/lib/types';

export default function AdminOrdersPage() {
    const { token } = useAdminAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        fetchOrders();
    }, [token, statusFilter]);

    const fetchOrders = async () => {
        if (!token) return;

        try {
            const data = await adminOrdersApi.getOrders(token, statusFilter);
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError('Impossible de charger les commandes');
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Commandes</h1>
                    <p className="mt-1 text-zinc-500">Gérez les commandes des clients</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-zinc-700">Statut :</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Toutes les commandes</option>
                        <option value="PENDING">En attente</option>
                        <option value="PAID">Payée</option>
                        <option value="PROCESSING">En préparation</option>
                        <option value="SHIPPED">Expédiée</option>
                        <option value="DELIVERED">Livrée</option>
                        <option value="CANCELLED">Annulée</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Chargement des commandes...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-600">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-zinc-500">Aucune commande trouvée</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    N° Commande
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-900">#{order.orderNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-zinc-900">{order.email}</div>
                                        {order.customer && (
                                            <div className="text-xs text-zinc-500">
                                                {order.customer.firstName} {order.customer.lastName}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-zinc-900">
                                        {(order.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status === 'PENDING' ? 'En attente' :
                                                order.status === 'PAID' ? 'Payée' :
                                                    order.status === 'PROCESSING' ? 'En cours' :
                                                        order.status === 'SHIPPED' ? 'Expédiée' :
                                                            order.status === 'DELIVERED' ? 'Livrée' :
                                                                order.status === 'CANCELLED' ? 'Annulée' : (order.status as string)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                        >
                                            Voir les détails
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Commandes totales</p>
                    <p className="text-2xl font-bold text-zinc-900">{orders.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">En attente</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter((o) => o.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">En cours</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {orders.filter((o) => o.status === 'PROCESSING' || o.status === 'SHIPPED').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Livrées</p>
                    <p className="text-2xl font-bold text-green-600">
                        {orders.filter((o) => o.status === 'DELIVERED').length}
                    </p>
                </div>
            </div>
        </div>
    );
}
