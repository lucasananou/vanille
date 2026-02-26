'use client';

import Link from 'next/link';

const LeafIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.4 8.7-1.2 3.5-4 5.4-7.8 5.7L11 20z" />
        <path d="M11 20c0-3.3 4.3-4.6 11-7" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="border-t border-vanilla-100/10 bg-jungle-900 text-vanilla-50">
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-14 h-14 rounded-xl overflow-hidden">
                                <img
                                    src="/logo_msv.png"
                                    alt="Logo MSV Nosy-Be"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="leading-tight">
                                <p className="font-display text-xl">M.S.V-NOSY BE</p>
                                <p className="text-sm text-vanilla-100/60">Vanille de Madagascar</p>
                            </div>
                        </Link>
                        <div className="inline-flex items-center gap-2 text-sm text-vanilla-100/80">
                            <span>100% naturel & sélectionné à la main.</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Liens</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/">Boutique</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/about">À propos</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/contact">Contact</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/b2b">B2B / Devis</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Infos</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/cart">Panier</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/legal/conditions-generales-de-vente">CGV</Link></li>
                            <li><Link className="hover:text-vanilla-50 transition-colors" href="/contact">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Réseaux</p>
                        <ul className="mt-3 space-y-2 text-sm text-vanilla-100/70">
                            <li><a className="hover:text-vanilla-50 transition-colors" href="https://www.instagram.com/m.s.vnosybe" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a className="hover:text-vanilla-50 transition-colors" href="https://www.facebook.com/abou.moridy" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-vanilla-100/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <p className="text-xs text-vanilla-100/60">
                            © {new Date().getFullYear()} M.S.V-NOSY BE • Design premium. Tous droits réservés.
                        </p>
                        <p className="text-xs text-vanilla-100/60">
                            Vanille de Madagascar — Terroir d'Exception
                        </p>
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
