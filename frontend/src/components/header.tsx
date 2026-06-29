'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useLocale } from '@/lib/locale-context';
import LocaleSwitcher from '@/components/locale-switcher';
import { withLocale } from '@/lib/i18n';

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
    const { copy, locale } = useLocale();

    return (
        <header
            className="sticky top-0 z-50 transition-all duration-300 border-b border-vanilla-100/10 py-2 text-vanilla-50"
            style={{ backgroundColor: '#0a2c1d' }}
        >
            <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-3">
                <Link href={withLocale('/', locale)} className="flex items-center gap-3 rounded-2xl px-1 py-1 focus-ring group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300">
                        <img
                            src="/logo_msv.png"
                            alt="MSV Nosy-Be logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="leading-tight">
                        <p className="font-display text-lg">M.S.V-NOSY BE</p>
                        <p className="text-xs text-vanilla-100/70">{copy.footer.baseline}</p>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-5 lg:gap-8">
                    <Link href={withLocale('/', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.home}</Link>
                    <Link href={withLocale('/shop', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.shop}</Link>
                    <Link href={withLocale('/actualites', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.news}</Link>
                    <Link href={withLocale('/blog', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.blog}</Link>
                    <Link href={withLocale('/about', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.about}</Link>
                    <Link href={withLocale('/engagements', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.commitments}</Link>
                    <Link href={withLocale('/b2b', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.professionals}</Link>
                    <Link href={withLocale('/contact', locale)} className="text-sm font-semibold hover:text-gold-500 transition-colors">{copy.nav.contact}</Link>
                </nav>

                <div className="flex items-center gap-2">
                    <div className="block">
                        <LocaleSwitcher />
                    </div>
                    <Link href={withLocale('/shop', locale)} className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                        {copy.actions.discoverShop}
                        <ArrowRightIcon />
                    </Link>

                    <button
                        onClick={openCart}
                        className="relative inline-flex items-center justify-center w-11 h-11 rounded-2xl glass hover:bg-vanilla-50/10 transition rm-anim focus-ring"
                        aria-label={copy.actions.openCart}
                    >
                        <CartIcon />
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold grid place-items-center bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900">
                            {itemCount}
                        </span>
                    </button>
                </div>
            </div>
            <nav className="mx-auto mt-2 flex max-w-7xl gap-4 overflow-x-auto px-4 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-vanilla-100/78 md:hidden">
                <Link href={withLocale('/shop', locale)} className="shrink-0 py-2 hover:text-gold-500">{copy.nav.shop}</Link>
                <Link href={withLocale('/actualites', locale)} className="shrink-0 py-2 hover:text-gold-500">{copy.nav.news}</Link>
                <Link href={withLocale('/blog', locale)} className="shrink-0 py-2 hover:text-gold-500">{copy.nav.blog}</Link>
                <Link href={withLocale('/b2b', locale)} className="shrink-0 py-2 hover:text-gold-500">{copy.nav.professionals}</Link>
                <Link href={withLocale('/contact', locale)} className="shrink-0 py-2 hover:text-gold-500">{copy.nav.contact}</Link>
            </nav>
        </header>
    );
}
