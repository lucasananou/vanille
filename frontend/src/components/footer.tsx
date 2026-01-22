'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-100 bg-white pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.png"
                                alt="Tsniout - Marque israélienne"
                                width={180}
                                height={60}
                                className="object-contain"
                            />
                        </Link>
                        <p className="mt-6 text-sm leading-relaxed text-zinc-500 max-w-xs">
                            L'alliance parfaite entre élégance, pudeur et modernité. Sublimez votre quotidien avec des tenues qui respectent vos valeurs.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a href="https://www.instagram.com/tsnioutshop/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 3.053c.636-.247 1.363-.416 2.427-.465C8.901 2.534 9.256 2.522 12.315 2zm-.975 2.163c-2.726 0-3.246.015-4.288.073-1.085.06-1.635.253-2.028.406-.52.201-.96.44-1.416.896-.456.456-.695.896-.896 1.416-.153.393-.346.943-.406 2.028-.058 1.042-.069 1.468-.069 4.348 0 2.812.008 3.238.073 4.348.056 1.009.24 1.554.393 1.948.201.52.44.96.896 1.416.456.456.896.695 1.416.896.393.153.943.346 2.028.406 1.042.058 1.468.069 4.348.069 2.812 0 3.238-.008 4.348-.073 1.009-.056 1.554-.24 1.948-.393.52-.201.96-.44 1.416-.896.456-.456.695-.896.896-1.416.153-.393.346-.943.406-2.028.058-1.042.069-1.468.069-4.348 0-2.812-.008-3.238-.073-4.348-.056-1.009-.24-1.554-.393-1.948-.201-.52-.44-.96-.896-1.416-.456-.456-.896-.695-1.416-.896-.393-.153-.943-.346-2.028-.406-1.042-.058-1.468-.069-4.348-.069zM12.315 7.828a5.172 5.172 0 110 10.344 5.172 5.172 0 010-10.344zm0 1.984a3.188 3.188 0 100 6.376 3.188 3.188 0 000-6.376zm6.357-5.545a1.298 1.298 0 110 2.596 1.298 1.298 0 010-2.596z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Boutique</h3>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-500 font-light">
                            <li><Link href="/" className="hover:text-[#a1b8ff] transition-colors">Nouveautés</Link></li>
                            <li><Link href="/" className="hover:text-[#a1b8ff] transition-colors">Meilleures Ventes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">À propos</h3>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-500 font-light">
                            <li><Link href="/legal/politique-d-expedition" className="hover:text-[#a1b8ff] transition-colors">Livraison & Retours</Link></li>
                            <li><Link href="/legal/politique-de-remboursement" className="hover:text-[#a1b8ff] transition-colors">Politique de remboursement</Link></li>
                            <li><Link href="/guide-des-tailles" className="hover:text-[#a1b8ff] transition-colors">Guide des tailles</Link></li>
                            <li><Link href="/faq" className="hover:text-[#a1b8ff] transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-[#a1b8ff] transition-colors">Contactez-nous</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Légal</h3>
                        <ul className="mt-4 space-y-3 text-sm text-zinc-500 font-light">
                            <li><Link href="/legal/mentions-legales" className="hover:text-[#a1b8ff] transition-colors">Mentions légales</Link></li>
                            <li><Link href="/legal/politique-de-confidentialite" className="hover:text-[#a1b8ff] transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/legal/conditions-generales-de-vente" className="hover:text-[#a1b8ff] transition-colors">Conditions générales de vente</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between border-t border-zinc-100 pt-8 sm:flex-row">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <p className="text-xs text-zinc-400">© 2026 Tsniout. Tous droits réservés.</p>
                        <span className="hidden sm:inline text-zinc-300">|</span>
                        <a href="https://orylis.fr" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">Une création de Orylis.fr</a>
                    </div>
                    <div className="mt-4 flex gap-4 sm:mt-0">
                        <svg className="w-5 h-5 text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 8H4V6h16v2zm0 2H4v6h16v-6zM3 5a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5z" />
                        </svg>
                    </div>
                </div>
            </div>
        </footer>
    );
}
