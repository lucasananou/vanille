'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    // Disable body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const links = [
        { href: '/jupe-longue-tsniout', label: 'Jupe Tsniout' },
        { href: '/robe-tsniout', label: 'Robe Tsniout' },
        { href: '/veste-tsniout', label: 'Veste Tsniout' },
        { href: '/pull-chemisier', label: 'Pull' },
        { href: '/chemisier', label: 'Chemisier' },
        { href: '/collier', label: 'Bijoux' },
        { href: '/blog', label: 'Blog' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={menuRef}
                className={`fixed inset-y-0 left-0 z-[101] w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                        <h2 className="text-lg font-bold text-zinc-900 font-serif">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="block px-6 py-3 text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 space-y-4">
                        <Link
                            href="/account"
                            onClick={onClose}
                            className="flex items-center gap-3 text-zinc-600 hover:text-zinc-900"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Mon Compte</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
