'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AccountPage() {
    const router = useRouter();
    const { customer, isAuthenticated, logout, isLoading } = useAuth();

    useEffect(() => {
        // Only redirect after loading is complete
        if (!isLoading && !isAuthenticated) {
            console.log('Not authenticated, redirecting to login');
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-zinc-500">Chargement...</p>
            </div>
        );
    }

    // Don't render anything while redirecting
    if (!isAuthenticated) {
        return null;
    }

    // Only show account page if authenticated
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Nav */}
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="text-xl font-medium tracking-tight text-zinc-900 uppercase hover:text-[#a1b8ff] transition-colors">
                        Tsniout
                    </Link>
                    <button
                        onClick={logout}
                        className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                        Se déconnecter
                    </button>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl px-6 py-12">
                <h1 className="text-3xl font-medium text-zinc-900 mb-8">Mon compte</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Account Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile */}
                        <div className="rounded-lg border border-zinc-200 p-6">
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">Informations du profil</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Nom</label>
                                    <p className="text-zinc-900">
                                        {customer?.firstName || customer?.lastName
                                            ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                                            : 'Non renseigné'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                                    <p className="text-zinc-900">{customer?.email}</p>
                                </div>
                                <button className="text-sm text-[#a1b8ff] hover:text-[#8da0ef] font-medium">
                                    Modifier le profil
                                </button>
                            </div>
                        </div>

                        {/* Orders */}
                        <div className="rounded-lg border border-zinc-200 p-6">
                            <h2 className="text-lg font-medium text-zinc-900 mb-4">Commandes récentes</h2>
                            <p className="text-sm text-zinc-500">Vous n'avez pas encore passé de commande.</p>
                            <Link
                                href="/"
                                className="mt-4 inline-block text-sm text-[#a1b8ff] hover:text-[#8da0ef] font-medium"
                            >
                                Commencer mes achats →
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <div className="rounded-lg border border-zinc-200 p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-4">Liens rapides</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/account/orders" className="text-zinc-600 hover:text-zinc-900">
                                        Commandes
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/account/addresses" className="text-zinc-600 hover:text-zinc-900">
                                        Adresses
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/account/wishlist" className="text-zinc-600 hover:text-zinc-900">
                                        Liste de souhaits
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/account/settings" className="text-zinc-600 hover:text-zinc-900">
                                        Paramètres
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={logout} className="text-red-600 hover:text-red-700">
                                        Se déconnecter
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
