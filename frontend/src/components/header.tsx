'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import MobileMenu from './mobile-menu';
import CartButton from './cart-button';

import SearchOverlay from './search-overlay';

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by rendering a consistent shell on server
    const navLinks = mounted ? (
        <>
            <Link href="/jupe-longue-tsniout" className="hover:text-zinc-900 transition-colors">Jupe Tsniout</Link>
            <Link href="/robe-tsniout" className="hover:text-zinc-900 transition-colors">Robe Tsniout</Link>
            <Link href="/veste-tsniout" className="hover:text-zinc-900 transition-colors">Veste Tsniout</Link>
            <Link href="/pull-chemisier" className="hover:text-zinc-900 transition-colors">Pull</Link>
            <Link href="/chemisier" className="hover:text-zinc-900 transition-colors">Chemisier</Link>
            <Link href="/collier" className="hover:text-zinc-900 transition-colors">Bijoux</Link>
            <Link href="/blog" className="hover:text-[#a1b8ff] transition-colors font-medium">Blog</Link>
        </>
    ) : null;
    return (
        <>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    {/* Mobile Menu */}
                    <button
                        className="block lg:hidden text-zinc-500 hover:text-zinc-900"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center group">
                        <Image
                            src="/logo.png"
                            alt="Tsniout - Marque israélienne"
                            width={180}
                            height={60}
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-500">
                        {navLinks}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-5">
                        <button
                            className="hidden sm:block p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <Link href="/account" className="hidden sm:block p-1 text-zinc-400 hover:text-zinc-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                        <CartButton />
                    </div>
                </div>
            </nav>
        </>
    );
}
