'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { communicationsApi } from '@/lib/api/communications';
import { useLocale } from '@/lib/locale-context';
import { trackFormSubmit } from '@/lib/analytics';
import {
    getContactEmail,
    getContactHours,
    getContactPhoneDisplay,
    getContactPhoneHref,
    getWhatsappHref,
} from '@/lib/site';

const EmailIcon = () => (
    <svg className="w-5 h-5 text-deepgreen-800" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5 text-deepgreen-800" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5 text-deepgreen-800" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const SendIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.8 11.8 0 0 0 12.12 0C5.5 0 .12 5.38.12 12c0 2.12.56 4.19 1.61 6.02L0 24l6.17-1.62A11.92 11.92 0 0 0 12.12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.6-8.52Zm-8.4 18.5a9.96 9.96 0 0 1-5.08-1.4l-.36-.21-3.66.96.98-3.56-.24-.37a9.9 9.9 0 0 1-1.54-5.4c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.1 1.02 6.97 2.9A9.8 9.8 0 0 1 22 12.1c0 5.45-4.44 9.88-9.88 9.88Zm5.42-7.4c-.3-.16-1.78-.88-2.06-.98-.28-.1-.48-.16-.68.16-.2.3-.78.98-.96 1.18-.18.2-.36.22-.66.08-.3-.16-1.28-.48-2.44-1.52-.9-.8-1.52-1.8-1.7-2.1-.18-.32-.02-.48.14-.64.14-.14.3-.36.46-.54.16-.18.2-.3.3-.5.1-.2.06-.38-.02-.54-.08-.16-.68-1.64-.94-2.24-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.54.08-.82.38-.28.3-1.08 1.06-1.08 2.58 0 1.52 1.1 3 1.26 3.2.16.2 2.14 3.26 5.18 4.56.72.32 1.28.5 1.72.64.72.22 1.38.18 1.9.12.58-.08 1.78-.72 2.04-1.42.26-.7.26-1.3.18-1.42-.08-.12-.28-.2-.58-.36Z" />
    </svg>
);

export default function ContactPage() {
    const { locale } = useLocale();
    const contactEmail = getContactEmail();
    const phoneDisplay = getContactPhoneDisplay();
    const phoneHref = getContactPhoneHref();
    const whatsappHref = getWhatsappHref(locale);
    const contactHours = getContactHours(locale);
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await communicationsApi.sendContactMessage(formData);
            trackFormSubmit('contact');
            setStatus(locale === 'en' ? 'Message sent. We will reply shortly.' : 'Message envoyé. Nous vous répondrons rapidement.');
            setFormData({ name: '', email: '', message: '' });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : null;
            setStatus(message || (locale === 'en' ? 'We are unable to send your message right now.' : 'Impossible d’envoyer votre message pour le moment.'));
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(null), 2600);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 text-vanilla-50 font-sans antialiased">
            <Header />

            <main className="flex-grow">
                <section className="relative overflow-hidden py-16 lg:py-24">
                    <div className="absolute inset-0 grain opacity-40" aria-hidden="true"></div>
                    <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 relative">
                        <div className="grid lg:grid-cols-2 gap-10 items-start">
                            <div>
                                <h1 className="font-display text-4xl text-vanilla-50 italic">Contact</h1>
                                <p className="text-vanilla-100/70 mt-4 text-lg">
                                    {locale === 'en'
                                        ? 'Reach our team for orders, bespoke sourcing, trade enquiries or pre-purchase advice.'
                                        : 'Contactez notre équipe pour une commande, une demande professionnelle ou un conseil avant achat.'}
                                </p>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-xxl glass p-5 border border-vanilla-100/10">
                                        <p className="text-sm font-semibold text-vanilla-50 flex items-center gap-2">
                                            <EmailIcon />
                                            Email
                                        </p>
                                        <a href={`mailto:${contactEmail}`} className="mt-2 inline-flex text-sm text-vanilla-100/80 hover:text-vanilla-50 transition-colors">
                                            {contactEmail}
                                        </a>
                                    </div>

                                    <div className="rounded-xxl glass p-5 border border-vanilla-100/10">
                                        <p className="text-sm font-semibold text-vanilla-50 flex items-center gap-2">
                                            <PhoneIcon />
                                            {locale === 'en' ? 'Phone / WhatsApp' : 'Téléphone / WhatsApp'}
                                        </p>
                                        <a href={phoneHref} className="mt-2 inline-flex text-sm text-vanilla-100/80 hover:text-vanilla-50 transition-colors">
                                            {phoneDisplay}
                                        </a>
                                    </div>

                                    <div className="rounded-xxl glass p-5 border border-vanilla-100/10">
                                        <p className="text-sm font-semibold text-vanilla-50 flex items-center gap-2">
                                            <ClockIcon />
                                            {locale === 'en' ? 'Availability' : 'Disponibilité'}
                                        </p>
                                        <p className="text-sm text-vanilla-100/70 mt-2">{contactHours}</p>
                                        <p className="text-xs text-vanilla-100/55 mt-2">
                                            {locale === 'en' ? 'Average response time: within 24 business hours.' : 'Temps de réponse moyen : sous 24 h ouvrées.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-all"
                                    >
                                        <WhatsAppIcon />
                                        {locale === 'en' ? 'Chat on WhatsApp' : 'Écrire sur WhatsApp'}
                                    </a>
                                    <a
                                        href={phoneHref}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-vanilla-100/15 bg-white/5 px-6 py-3 text-sm font-semibold text-vanilla-50 hover:bg-white/10 transition-all"
                                    >
                                        {locale === 'en' ? 'Call us' : 'Nous appeler'}
                                    </a>
                                </div>
                            </div>

                            <div className="rounded-xxl glass p-6 border border-vanilla-100/10">
                                <h2 className="font-display text-2xl text-vanilla-50">{locale === 'en' ? 'Send a message' : 'Envoyer un message'}</h2>
                                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-vanilla-50" htmlFor="name">{locale === 'en' ? 'Name' : 'Nom'}</label>
                                            <input
                                                id="name"
                                                required
                                                className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder={locale === 'en' ? 'Your name' : 'Votre nom'}
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-vanilla-50" htmlFor="email">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder={locale === 'en' ? 'you@example.com' : 'vous@exemple.com'}
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-vanilla-50" htmlFor="message">{locale === 'en' ? 'Message' : 'Message'}</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            className="mt-2 w-full rounded-xl border border-vanilla-100/20 bg-vanilla-50/5 px-3 py-2 text-sm text-vanilla-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                            placeholder={locale === 'en' ? 'Write your message…' : 'Écrivez votre message…'}
                                            value={formData.message}
                                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-jungle-900 hover:opacity-90 transition-all font-bold"
                                    >
                                        {isSubmitting ? (locale === 'en' ? 'Sending...' : 'Envoi...') : (locale === 'en' ? 'Send' : 'Envoyer')} <SendIcon />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {status && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-full bg-cocoa-900 text-white text-sm border border-vanilla-100/20 transition-all animate-fade-in-up">
                    {status}
                </div>
            )}
        </div>
    );
}
