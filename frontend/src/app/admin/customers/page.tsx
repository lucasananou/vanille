'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminCustomersApi, type Customer } from '@/lib/api/admin-customers';

export default function AdminCustomersPage() {
    const { token } = useAdminAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, [token]);

    const fetchCustomers = async () => {
        if (!token) return;

        try {
            const data = await adminCustomersApi.getCustomers(token);
            setCustomers(data);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
            setError('Impossible de charger les clients');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Clients</h1>
                    <p className="mt-1 text-zinc-500">Gérez vos clients</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher des clients..."
                    className="w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-zinc-500">Chargement des clients...</div>
                ) : error ? (
                    <div className="p-12 text-center text-red-600">{error}</div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-zinc-500">Aucun client trouvé</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Commandes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Inscrit le
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-zinc-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-medium text-sm">
                                                    {customer.firstName?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-zinc-900">
                                                    {customer.firstName || customer.lastName
                                                        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                                                        : 'N/A'}
                                                </div>
                                                <div className="text-xs text-zinc-500">{customer.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">{customer.email}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {customer._count?.orders || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-600">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/customers/${customer.id}`}
                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                        >
                                            Voir le profil
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Clients totaux</p>
                    <p className="text-2xl font-bold text-zinc-900">{customers.length}</p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Nouveaux ce mois-ci</p>
                    <p className="text-2xl font-bold text-green-600">
                        {customers.filter((c) => {
                            const created = new Date(c.createdAt);
                            const now = new Date();
                            return (
                                created.getMonth() === now.getMonth() &&
                                created.getFullYear() === now.getFullYear()
                            );
                        }).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Avec commandes</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {customers.filter((c) => (c._count?.orders || 0) > 0).length}
                    </p>
                </div>
            </div>
        </div>
    );
}
