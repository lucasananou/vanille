'use client';

import { useState } from 'react';
import { communicationsApi } from '@/lib/api/communications';
import { useLocale } from '@/lib/locale-context';
import { trackFormSubmit } from '@/lib/analytics';

export default function NewsletterSignup() {
    const { locale } = useLocale();
    const isEn = locale === 'en';
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            await communicationsApi.subscribeNewsletter({ email });
            trackFormSubmit('newsletter');
            setStatus('ok');
            setEmail('');
        } catch {
            setStatus('error');
        } finally {
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <div className="rounded-2xl border border-vanilla-100/10 bg-vanilla-50/5 p-6">
            <p className="font-display text-lg text-vanilla-50">
                {isEn ? 'Importer newsletter' : 'Newsletter importateurs'}
            </p>
            <p className="mt-2 text-sm text-vanilla-100/70">
                {isEn
                    ? 'Receive our harvest updates, availabilities and new lots.'
                    : 'Recevez nos infos récolte, disponibilités et nouveaux lots.'}
            </p>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="newsletter-email">Email</label>
                <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? 'you@company.com' : 'vous@entreprise.com'}
                    className="w-full flex-1 rounded-full border border-vanilla-100/20 bg-jungle-950/40 px-4 py-2.5 text-sm text-vanilla-50 placeholder:text-vanilla-100/40 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="shrink-0 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-semibold text-jungle-900 transition hover:opacity-90 disabled:opacity-60"
                >
                    {status === 'loading' ? (isEn ? 'Sending…' : 'Envoi…') : (isEn ? 'Subscribe' : "S'inscrire")}
                </button>
            </form>
            {status === 'ok' ? (
                <p className="mt-2 text-xs font-semibold text-gold-300">
                    {isEn ? 'Thank you! You are subscribed.' : 'Merci ! Votre inscription est enregistrée.'}
                </p>
            ) : null}
            {status === 'error' ? (
                <p className="mt-2 text-xs font-semibold text-red-300">
                    {isEn ? 'Something went wrong, please try again.' : 'Une erreur est survenue, réessayez.'}
                </p>
            ) : null}
        </div>
    );
}
