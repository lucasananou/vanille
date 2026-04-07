'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';

export default function Footer() {
    const { copy, locale } = useLocale();

    return (
        <footer className="border-t border-vanilla-100/10 bg-jungle-900 text-vanilla-50">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href={withLocale('/', locale)} className="flex items-center gap-3 group">
                            <div className="w-14 h-14 rounded-xl overflow-hidden">
                                <img
                                    src="/logo_msv.png"
                                    alt="MSV Nosy-Be logo"
                                    className="w-full h-full object-contain"
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
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/shop', locale)}>{copy.nav.shop}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/blog', locale)}>{copy.nav.blog}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/about', locale)}>{copy.nav.about}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/contact', locale)}>{copy.nav.contact}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/b2b', locale)}>{locale === 'en' ? 'B2B / Quote' : 'B2B / Devis'}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{copy.footer.info}</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/cart', locale)}>{copy.footer.cart}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/legal/conditions-generales-de-vente', locale)}>{copy.footer.terms}</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href={withLocale('/faq', locale)}>{copy.footer.faq}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{copy.footer.social}</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><a className="hover:text-vanilla-50 transition-colors" href="https://www.instagram.com/m.s.vnosybe" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a className="hover:text-vanilla-50 transition-colors" href="https://www.facebook.com/abou.moridy" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-vanilla-100/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <p className="text-xs text-vanilla-100/60">
                            © {new Date().getFullYear()} M.S.V-NOSY BE • {locale === 'en' ? 'Premium design.' : 'Design premium.'} {copy.footer.rights} — {locale === 'en' ? 'A creation by' : 'Une création de'} <a href="https://orylis.fr" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">Orylis.fr</a>
                        </p>
                        <p className="text-xs text-vanilla-100/60">{copy.footer.terroir}</p>
                    </div>

                    <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 w-auto grayscale brightness-200" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 w-auto grayscale brightness-200" />
                        <div className="h-4 w-px bg-vanilla-100/20 mx-1" />
                        <div className="flex gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto grayscale brightness-200" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 w-auto grayscale brightness-200" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
