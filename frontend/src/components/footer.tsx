'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';
import NewsletterSignup from '@/components/newsletter-signup';

export default function Footer() {
    const { copy, locale } = useLocale();

    return (
        <footer className="border-t border-vanilla-100/10 bg-jungle-900 text-vanilla-50">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="mb-10">
                    <NewsletterSignup />
                </div>
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href={withLocale('/', locale)} className="group flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-xl">
                                <img
                                    src="/logo_msv.png"
                                    alt="MSV Nosy-Be logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <div className="leading-tight">
                                <p className="font-display text-xl">M.S.V-NOSY BE</p>
                                <p className="text-sm text-vanilla-100/60">{copy.footer.baseline}</p>
                            </div>
                        </Link>
                        <div className="inline-flex items-center gap-2 text-sm text-vanilla-100/80">
                            <span>{copy.footer.promise}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">{copy.footer.links}</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/shop', locale)}>{copy.nav.shop}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/actualites', locale)}>{copy.nav.news}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/blog', locale)}>{copy.nav.blog}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/about', locale)}>{copy.nav.about}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/notre-plantation', locale)}>{locale === 'en' ? 'Our plantation' : 'Notre plantation'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/tracabilite', locale)}>{locale === 'en' ? 'Traceability' : 'Traçabilité'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/engagements', locale)}>{copy.nav.commitments}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/contact', locale)}>{copy.nav.contact}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/b2b', locale)}>{locale === 'en' ? 'B2B / Quote' : 'B2B / Devis'}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">{copy.footer.info}</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/cart', locale)}>{copy.footer.cart}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/faq', locale)}>{copy.footer.faq}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/telechargements', locale)}>{locale === 'en' ? 'Downloads' : 'Téléchargements'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/conditions-generales-de-vente', locale)}>{copy.footer.terms}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/mentions-legales', locale)}>{locale === 'en' ? 'Legal notice' : 'Mentions légales'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/politique-de-confidentialite', locale)}>{locale === 'en' ? 'Privacy policy' : 'Politique de confidentialité'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/politique-d-expedition', locale)}>{locale === 'en' ? 'Shipping policy' : 'Politique d’expédition'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/politique-de-remboursement', locale)}>{locale === 'en' ? 'Refund policy' : 'Politique de remboursement'}</Link></li>
                            <li><Link className="transition-colors hover:text-vanilla-50" href={withLocale('/legal/politique-de-cookies', locale)}>{locale === 'en' ? 'Cookies policy' : 'Politique de cookies'}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold">{copy.footer.social}</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><a className="transition-colors hover:text-vanilla-50" href="https://www.instagram.com/m.s.vnosybe" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a className="transition-colors hover:text-vanilla-50" href="https://www.facebook.com/abou.moridy" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-vanilla-100/10 pt-6 sm:flex-row sm:items-center">
                    <div className="space-y-3">
                        <p className="text-xs text-vanilla-100/60">
                            © {new Date().getFullYear()} M.S.V-NOSY BE • {locale === 'en' ? 'Premium design.' : 'Design premium.'} {copy.footer.rights} — {locale === 'en' ? 'A creation by' : 'Une création de'} <a href="https://orylis.fr" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold-500">Orylis.fr</a>
                        </p>
                        <p className="text-xs text-vanilla-100/60">{copy.footer.terroir}</p>
                    </div>

                    <div className="flex flex-col items-start gap-4 sm:items-end">
                        <div className="flex items-center gap-4 opacity-70 transition-opacity hover:opacity-100">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-vanilla-100/50">{locale === 'en' ? 'Payment' : 'Paiement'}</span>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 w-auto grayscale brightness-200" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 w-auto grayscale brightness-200" />
                            <div className="mx-1 h-4 w-px bg-vanilla-100/20" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto grayscale brightness-200" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto grayscale brightness-200" />
                        </div>
                        <div className="flex items-center gap-4 opacity-70 transition-opacity hover:opacity-100">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-vanilla-100/50">{locale === 'en' ? 'Shipping' : 'Livraison'}</span>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg" alt="DHL" className="h-3.5 w-auto grayscale brightness-200" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/FedEx_Corporation_-_2016_Logo.svg" alt="FedEx" className="h-3.5 w-auto grayscale brightness-200" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/United_Parcel_Service_logo_2014.svg" alt="UPS" className="h-5 w-auto grayscale brightness-200" />
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300">
                            {locale === 'en' ? 'Approved vanilla exporter — Madagascar' : 'Exportateur de vanille agréé — Madagascar'}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
