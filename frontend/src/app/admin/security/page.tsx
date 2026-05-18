'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/lib/api/admin-auth';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function AdminSecurityPage() {
    const router = useRouter();
    const { admin, token, logout } = useAdminAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError('Session expirée. Merci de vous reconnecter.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('La confirmation ne correspond pas au nouveau mot de passe.');
            return;
        }

        setIsSaving(true);

        try {
            await adminAuthApi.changePassword({ currentPassword, newPassword }, token);
            resetForm();
            setSuccess('Mot de passe modifié. Vous allez être redirigé vers la connexion.');

            window.setTimeout(() => {
                logout();
                router.push('/admin/login');
            }, 1400);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Impossible de modifier le mot de passe.';
            setError(message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Sécurité</h1>
                <p className="mt-1 text-zinc-500">
                    Modifiez le mot de passe du compte administrateur connecté.
                </p>
            </div>

            <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">Changer le mot de passe</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        Par sécurité, l’ancien mot de passe est demandé avant toute modification.
                    </p>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-zinc-700">
                                Mot de passe actuel
                            </label>
                            <input
                                id="currentPassword"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoComplete="current-password"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-zinc-700">
                                Nouveau mot de passe
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoComplete="new-password"
                            />
                            <p className="mt-2 text-xs text-zinc-500">
                                Minimum 8 caractères. Utilisez un mot de passe unique pour l’administration.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-zinc-700">
                                Confirmer le nouveau mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                            >
                                {isSaving ? 'Modification...' : 'Modifier le mot de passe'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSaving}
                                className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900">Compte connecté</h2>
                    <div className="mt-4 rounded-lg bg-zinc-50 p-4">
                        <p className="text-sm font-medium text-zinc-900">{admin?.email}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">{admin?.role}</p>
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-zinc-600">
                        <p>Après modification, la session est fermée automatiquement.</p>
                        <p>L’administrateur devra se reconnecter avec son nouveau mot de passe.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
