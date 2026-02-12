'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';

const VanillaIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const CartIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);

export default function Header() {
    const { itemCount, openCart } = useCart();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="sticky top-0 z-50 transition-all duration-300 border-b border-vanilla-100/10 py-2 text-vanilla-50"
            style={{ backgroundColor: '#0a2c1d' }}
        >
            <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-3">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-1 focus-ring group">
                    <div className="w-10 h-10 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/15 grid place-items-center transition-all duration-300">
                        <VanillaIcon />
                    </div>
                    <div className="leading-tight">
                        <p className="font-display text-lg">MSV Nosy-Be</p>
                        <p className="text-xs text-vanilla-100/70">Vanille de Madagascar</p>
                    </div>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-sm font-semibold hover:text-gold-500 transition-colors">Boutique</Link>
                    <Link href="/about" className="text-sm font-semibold hover:text-gold-500 transition-colors">À propos</Link>
                    <Link href="/b2b" className="text-sm font-semibold hover:text-gold-500 transition-colors">Professionnels</Link>
                    <Link href="/contact" className="text-sm font-semibold hover:text-gold-500 transition-colors">Contact</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Link href="/shop" className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                        Boutique
                        <ArrowRightIcon />
                    </Link>

                    {/* Cart button */}
                    <button
                        onClick={openCart}
                        className="relative inline-flex items-center justify-center w-11 h-11 rounded-2xl glass hover:bg-vanilla-50/10 transition rm-anim focus-ring"
                        aria-label="Ouvrir le panier"
                    >
                        <CartIcon />
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold grid place-items-center
                                 bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900">
                            {itemCount}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
