'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useState } from 'react';
import { communicationsApi } from '@/lib/api/communications';
import { useLocale } from '@/lib/locale-context';
import { trackFormSubmit } from '@/lib/analytics';
import { getContactPhoneDisplay, getWhatsappHref } from '@/lib/site';

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

const BuildingIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
);

export default function B2BPage() {
    const { locale } = useLocale();
    const whatsappHref = getWhatsappHref(locale);
    const phoneDisplay = getContactPhoneDisplay();
    const [status, setStatus] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        email: '',
        need: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await communicationsApi.sendB2BLead(formData);
            trackFormSubmit('b2b_quote');
            setStatus(locale === 'en' ? 'Quote request sent. Our team will contact you shortly.' : 'Demande de devis envoyée. Notre équipe vous recontactera rapidement.');
            setFormData({ company: '', email: '', need: '' });
        } catch (error: unknown) {
            setStatus(error instanceof Error ? error.message : (locale === 'en' ? 'We are unable to send your request right now.' : 'Impossible d’envoyer votre demande pour le moment.'));
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-vanilla-50 font-sans antialiased text-jungle-950">
            <Header />

            <main className="flex-grow">
                <section className="relative overflow-hidden py-16 lg:py-24">
                    <div className="absolute inset-0 grain opacity-20" aria-hidden="true"></div>
                    <div className="relative mx-auto max-w-7xl px-4">
                        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-50 px-4 py-2 text-sm font-semibold text-jungle-900">
                                    <BuildingIcon />
                                    <span>{locale === 'en' ? 'B2B / Wholesale' : 'B2B / Professionnels'}</span>
                                </div>

                                <h1 className="mt-8 font-display text-4xl italic leading-tight sm:text-5xl lg:text-6xl">
                                    {locale === 'en'
                                        ? 'Vanilla for chefs, retailers and premium ingredient buyers.'
                                        : 'Une vanille pour les chefs, revendeurs et acheteurs d’ingrédients premium.'}
                                </h1>

                                <p className="mt-6 text-lg leading-relaxed text-jungle-700">
                                    {locale === 'en'
                                        ? 'This page is designed to answer the practical questions of professional buyers: product type, volumes, packaging, contact method and quote request.'
                                        : 'Cette page répond aux questions pratiques des acheteurs professionnels: types de produits, volumes, conditionnements, mode de contact et demande de devis.'}
                                </p>

                                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                    {[
                                        locale === 'en' ? 'TK and Gourmet grades' : 'Grades TK et Gourmet',
                                        locale === 'en' ? 'Retail or trade formats' : 'Formats détail ou professionnels',
                                        locale === 'en' ? 'Direct response by WhatsApp or email' : 'Réponse directe par WhatsApp ou email',
                                    ].map((item) => (
                                        <div key={item} className="rounded-2xl border border-vanilla-200 bg-white p-4 text-sm font-semibold text-jungle-900 shadow-sm">
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                                    <div className="rounded-[2rem] border border-vanilla-200 bg-white p-7 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                            {locale === 'en' ? 'Products and grades' : 'Produits et grades'}
                                        </p>
                                        <div className="mt-5 space-y-4 text-sm leading-relaxed text-jungle-800">
                                            <p>
                                                <strong>{locale === 'en' ? 'Gourmet' : 'Gourmet'}</strong>
                                                {locale === 'en'
                                                    ? ': suited to premium pastry, retail presentation and gift-ready formats.'
                                                    : ': adapté à la pâtisserie premium, à la revente et aux formats cadeaux.'}
                                            </p>
                                            <p>
                                                <strong>{locale === 'en' ? 'TK' : 'TK'}</strong>
                                                {locale === 'en'
                                                    ? ': suited to processing, culinary use, extracts and larger-volume sourcing.'
                                                    : ': adapté à la transformation, aux usages culinaires, aux extraits et aux besoins en volume.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[2rem] border border-vanilla-200 bg-white p-7 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                            {locale === 'en' ? 'Volumes and packaging' : 'Volumes et conditionnements'}
                                        </p>
                                        <div className="mt-5 space-y-4 text-sm leading-relaxed text-jungle-800">
                                            <p>
                                                {locale === 'en'
                                                    ? 'Retail-ready tubes, vacuum-sealed packs and quote-based volumes can be discussed depending on your activity and cadence.'
                                                    : 'Tubes prêts à la vente, packs sous-vide et volumes sur devis peuvent être étudiés selon votre activité et votre cadence d’approvisionnement.'}
                                            </p>
                                            <p>
                                                {locale === 'en'
                                                    ? 'If you need recurring supply, the fastest route is to describe your format, estimated quantity and frequency.'
                                                    : 'Si vous avez besoin d’un réassort récurrent, le plus simple est d’indiquer votre format, la quantité estimée et la fréquence souhaitée.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[2rem] border border-vanilla-200 bg-white p-7 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                            {locale === 'en' ? 'Who this page is for' : 'Pour qui'}
                                        </p>
                                        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-jungle-800">
                                            {(locale === 'en'
                                                ? ['Pastry chefs', 'Restaurants', 'Retailers', 'Importers', 'Fine food buyers']
                                                : ['Pâtissiers', 'Restaurants', 'Revendeurs', 'Importateurs', 'Acheteurs premium']
                                            ).map((tag) => (
                                                <span key={tag} className="rounded-full border border-vanilla-200 bg-vanilla-50 px-3 py-2">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-[2rem] border border-vanilla-200 bg-white p-7 shadow-sm">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold-700">
                                            {locale === 'en' ? 'Trust markers' : 'Repères de confiance'}
                                        </p>
                                        <div className="mt-5 space-y-3 text-sm leading-relaxed text-jungle-800">
                                            <p>{locale === 'en' ? 'Company: MORIDY SOANJARA VANILLE NOSY-BE' : 'Société: MORIDY SOANJARA VANILLE NOSY-BE'}</p>
                                            <p>{locale === 'en' ? 'Origin: Nosy-Be, Madagascar' : 'Origine: Nosy-Be, Madagascar'}</p>
                                            <p>{locale === 'en' ? `Direct phone: ${phoneDisplay}` : `Téléphone direct: ${phoneDisplay}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:sticky lg:top-24">
                                <div className="rounded-[2rem] border border-vanilla-200 bg-white p-8 shadow-2xl">
                                    <h2 className="font-display text-3xl italic text-jungle-900">
                                        {locale === 'en' ? 'Request a quote' : 'Demande de devis'}
                                    </h2>
                                    <p className="mt-3 text-sm leading-relaxed text-jungle-700">
                                        {locale === 'en'
                                            ? 'Tell us who you are, what format you need and roughly what volume you expect.'
                                            : 'Indiquez votre activité, le format recherché et le volume estimé pour obtenir une réponse adaptée.'}
                                    </p>

                                    {whatsappHref ? (
                                        <a
                                            href={whatsappHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                        >
                                            {locale === 'en' ? 'Discuss on WhatsApp first' : 'Échanger d’abord sur WhatsApp'}
                                        </a>
                                    ) : null}

                                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-jungle-700" htmlFor="company">
                                                {locale === 'en' ? 'Company / Restaurant' : 'Entreprise / Restaurant'}
                                            </label>
                                            <input
                                                id="company"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-200 bg-vanilla-50 px-4 py-3 text-sm text-jungle-900 placeholder:text-jungle-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder={locale === 'en' ? 'Business name' : 'Nom de l’établissement'}
                                                value={formData.company}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-jungle-700" htmlFor="b2bemail">
                                                {locale === 'en' ? 'Business email' : 'Email professionnel'}
                                            </label>
                                            <input
                                                id="b2bemail"
                                                type="email"
                                                required
                                                className="w-full rounded-2xl border border-vanilla-200 bg-vanilla-50 px-4 py-3 text-sm text-jungle-900 placeholder:text-jungle-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder={locale === 'en' ? 'contact@company.com' : 'contact@entreprise.fr'}
                                                value={formData.email}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-jungle-700" htmlFor="need">
                                                {locale === 'en' ? 'Need details' : 'Détail du besoin'}
                                            </label>
                                            <textarea
                                                id="need"
                                                rows={5}
                                                required
                                                className="w-full rounded-2xl border border-vanilla-200 bg-vanilla-50 px-4 py-3 text-sm text-jungle-900 placeholder:text-jungle-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                                                placeholder={locale === 'en' ? 'Example: TK pods, 5 kg, monthly delivery, France.' : 'Exemple : gousses TK, 5 kg, livraison mensuelle, France.'}
                                                value={formData.need}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, need: e.target.value }))}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-b from-gold-500 to-gold-600 px-8 py-4 text-sm font-bold text-jungle-900 shadow-lg transition-all hover:opacity-90"
                                        >
                                            {isSubmitting ? (locale === 'en' ? 'Sending...' : 'Envoi en cours...') : (locale === 'en' ? 'Send request' : 'Envoyer ma demande')}
                                            <ArrowRightIcon />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {status ? (
                <div className="fixed bottom-10 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-gold-500/20 bg-jungle-900 px-6 py-4 text-sm text-vanilla-50 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-gold-500"></div>
                        {status}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
