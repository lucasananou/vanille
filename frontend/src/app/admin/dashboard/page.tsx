'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { adminDashboardApi, type DashboardOverview } from '@/lib/api/admin-dashboard';

export default function AdminDashboardPage() {
    const { token } = useAdminAuth();
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOverview = async () => {
            if (!token) return;

            try {
                const data = await adminDashboardApi.getOverview(token);
                setOverview(data);
            } catch (err) {
                console.error('Failed to fetch overview:', err);
                setError('Impossible de charger les données du tableau de bord');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOverview();
    }, [token]);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-zinc-200 rounded w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-zinc-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !overview) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    {error || 'Impossible de charger le tableau de bord'}
                </div>
            </div>
        );
    }

    const stats = [
        {
            name: 'Chiffre d\'affaires total',
            value: `${((overview.totalRevenue || 0) / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`,
            change: overview.revenueChange || 0,
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-green-600 bg-green-100',
        },
        {
            name: 'Commandes totales',
            value: (overview.totalOrders || 0).toLocaleString('fr-FR'),
            change: overview.ordersChange || 0,
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            color: 'text-blue-600 bg-blue-100',
        },
        {
            name: 'Clients totaux',
            value: (overview.totalCustomers || 0).toLocaleString('fr-FR'),
            change: overview.customersChange || 0,
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            color: 'text-purple-600 bg-purple-100',
        },
        {
            name: 'Produits totaux',
            value: (overview.totalProducts || 0).toLocaleString('fr-FR'),
            change: 0,
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
            color: 'text-amber-600 bg-amber-100',
        },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Tableau de bord</h1>
                <p className="mt-1 text-zinc-500">Ravi de vous revoir ! Voici ce qui se passe dans votre boutique.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl border border-zinc-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                </svg>
                            </div>
                            {stat.change !== 0 && (
                                <span
                                    className={`text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {stat.change > 0 ? '+' : ''}
                                    {stat.change}%
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                            <p className="mt-1 text-2xl font-bold text-zinc-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-zinc-200 p-6">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-4">Actions Rapides</h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/products/new"
                            className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50 transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="font-medium text-zinc-900">Ajouter un produit</span>
                            </div>
                            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                        <a
                            href="/admin/orders"
                            className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50 transition group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="font-medium text-zinc-900">Voir les commandes</span>
                            </div>
                            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                    <h2 className="text-lg font-semibold mb-2">Performance de la boutique</h2>
                    <p className="text-indigo-100 mb-6">Votre boutique se porte bien ce mois-ci !</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-100">Taux de conversion</span>
                            <span className="font-semibold">2,4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-100">Valeur moy. de commande</span>
                            <span className="font-semibold">127,50 €</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-100">Satisfaction client</span>
                            <span className="font-semibold">4,8/5,0</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder for charts and tables */}
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Activité Récente</h2>
                <p className="text-zinc-500 text-center py-12">Les graphiques et les commandes récentes seront affichés ici</p>
            </div>
        </div>
    );
}
