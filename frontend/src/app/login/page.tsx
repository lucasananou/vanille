'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log('Login attempt with:', email);

        try {
            await login(email, password);
            console.log('Login successful! Redirecting...');

            // Use window.location for full page reload to ensure auth state is loaded
            window.location.href = '/account';
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
            setIsLoading(false);
        }
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

            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-medium text-zinc-900">Bon retour</h1>
                        <p className="mt-2 text-zinc-500">Connectez-vous à votre compte</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                placeholder="vous@exemple.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-zinc-300" />
                                <span className="text-zinc-600">Se souvenir de moi</span>
                            </label>
                            <Link href="/forgot-password" className="text-[#a1b8ff] hover:text-[#8da0ef]">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-zinc-600">
                            Vous n'avez pas de compte ?{' '}
                            <Link href="/register" className="font-medium text-[#a1b8ff] hover:text-[#8da0ef]">
                                Créer un compte
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
