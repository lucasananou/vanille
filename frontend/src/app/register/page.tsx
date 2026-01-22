'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setIsLoading(true);

        try {
            await register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
            );

            // Use window.location for full page reload
            window.location.href = '/account';
        } catch (err: any) {
            setError(err.message || "Échec de l'inscription. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Simple Nav */}
            <nav className="border-b border-zinc-100">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Tsniout"
                            width={180}
                            height={60}
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>
            </nav>

            {/* Register Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-medium text-zinc-900">Créer un compte</h1>
                        <p className="mt-2 text-zinc-500">Rejoignez AP Collections dès aujourd'hui</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-900 mb-2">
                                    Prénom
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-900 mb-2">
                                    Nom
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                    placeholder="Pierre"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                                Adresse email *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                placeholder="vous@exemple.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                                Mot de passe *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-xs text-zinc-500">Minimum 6 caractères</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-900 mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Création du compte...' : 'Créer un compte'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-zinc-600">
                            Vous avez déjà un compte ?{' '}
                            <Link href="/login" className="font-medium text-[#a1b8ff] hover:text-[#8da0ef]">
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 border-t border-zinc-200 pt-8">
                        <Link href="/" className="block text-center text-sm text-zinc-600 hover:text-zinc-900">
                            ← Retour à la boutique
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
