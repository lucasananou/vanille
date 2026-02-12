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
                    <div>
                        <p className="font-display text-xl">MSV Nosy-Be</p>
                        <p className="mt-2 text-sm text-vanilla-100/70">Vanille de Madagascar — expérience premium.</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm text-vanilla-100/80">
                            <LeafIcon />
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
                            <li><a className="hover:text-vanilla-50 transition-colors" href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                            <li><a className="hover:text-vanilla-50 transition-colors" href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-vanilla-100/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs text-vanilla-100/60">
                        © {new Date().getFullYear()} MSV Nosy-Be • Design premium. Tous droits réservés.
                    </p>
                    <p className="text-xs text-vanilla-100/60">
                        Vanille de Madagascar — Terroir d'Exception
                    </p>
                </div>
            </div>
        </footer>
    );
}
