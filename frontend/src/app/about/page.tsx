'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';

const VanillaIcon = () => (
    <svg className="w-8 h-8 text-gold-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);

const LeafIcon = () => (
    <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.4 8.7-1.2 3.5-4 5.4-7.8 5.7L11 20z" />
        <path d="M11 20c0-3.3 4.3-4.6 11-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-jungle-900 font-sans antialiased text-vanilla-50">
            <Header />

            <main id="content" className="flex-grow">
                {/* HERO SECTION - Jungle Dark */}
                <section className="relative overflow-hidden bg-jungle-900 pb-20">
                    <div className="absolute inset-0 shine grain opacity-40" aria-hidden="true"></div>

                    {/* Decorative halos */}
                    <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gold-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>

                    <div className="relative mx-auto max-w-7xl px-4 pt-14 lg:pt-20">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-vanilla-50">
                                    <LeafIcon />
                                    <span className="text-sm font-semibold uppercase tracking-widest">Notre Histoire • MSV Nosy-Be</span>
                                </div>

                                <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl italic leading-tight text-vanilla-50">
                                    De la terre de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Nosy-Be</span> à votre assiette.
                                </h1>
                                <p className="mt-6 text-xl text-vanilla-100/80 leading-relaxed max-w-xl">
                                    Plus qu&apos;une épice, une passion pour l&apos;excellence. Découvrez comment nous sélectionnons et affinons la meilleure vanille de Madagascar.
                                </p>

                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <Link href="/shop" className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition-all">
                                        Voir la boutique
                                        <ArrowRightIcon />
                                    </Link>
                                    <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold glass hover:bg-vanilla-50/10 transition-all text-vanilla-50">
                                        Nous contacter
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="rounded-[3rem] border border-vanilla-100/10 bg-vanilla-50/5 overflow-hidden p-3 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] relative">
                                    <div className="w-full h-full rounded-[2.5rem] bg-jungle-950/40 relative overflow-hidden">
                                        <img
                                            src="/photos produit vanille/Galerie photos qui sommes nous/PDG sur le terrain.jpg"
                                            alt="L'art de l'affinage"
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative text-center px-8">
                                                <p className="font-display text-3xl italic text-vanilla-50">L&apos;art de l&apos;affinage</p>
                                                <p className="mt-4 text-sm text-vanilla-100/60 max-w-xs">Chaque lot est scruté, senti et sélectionné avec une rigueur absolue.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating stats */}
                                    <div className="absolute -bottom-6 -left-6 rounded-3xl glass p-6 border border-vanilla-100/10 animate-float">
                                        <p className="text-3xl font-display italic text-gold-500">100%</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-vanilla-100/60">Naturel</p>
                                    </div>
                                    <div className="absolute -top-6 -right-6 rounded-3xl glass p-6 border border-vanilla-100/10 animate-float [animation-delay:-2s]">
                                        <p className="text-3xl font-display italic text-gold-500">Direct</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-vanilla-100/60">Producteur</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTENT SECTION - Vanilla Light */}
                <section className="bg-vanilla-50 text-jungle-900 py-20 lg:py-32">
                    <div className="mx-auto max-w-4xl px-4">
                        <div className="space-y-12 text-lg leading-relaxed text-jungle-800/80">
                            <div className="space-y-6">
                                <h2 className="font-display text-4xl text-jungle-950 italic">Notre Histoire</h2>
                                <p>
                                    La S.A.R.L MORIDY SOANJARA VANILLE NOSY-BE (M.S.V – Nosy Be) a été fondée le 30 mai 2023 à Nosy Be, une région historiquement reconnue pour l&apos;excellence de sa vanille. Notre entreprise s&apos;appuie sur un savoir-faire traditionnel transmis de génération en génération, bénéficiant des conditions climatiques idéales de l&apos;&quot;Île aux Parfums&quot;.
                                </p>
                                <p>
                                    Sous la direction de Monsieur ABOU MORIDY, nous maîtrisons l&apos;intégralité de la chaîne de valeur : de la production agricole à la transformation, l&apos;affinage, le stockage et l&apos;exportation internationale.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8 py-8">
                                <div className="rounded-[2rem] bg-white border border-vanilla-200 p-8 shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-vanilla-50 border border-vanilla-100 flex items-center justify-center text-gold-600 mb-6">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    </div>
                                    <h3 className="font-display text-2xl text-jungle-950 italic mb-4">Notre Mission</h3>
                                    <p className="text-sm leading-relaxed">
                                        Fournir une vanille malgache de haute qualité, traçable et conforme aux normes internationales, tout en portant une attention particulière aux marchés exigeants comme les États-Unis.
                                    </p>
                                </div>
                                <div className="rounded-[2rem] bg-white border border-vanilla-200 p-8 shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-vanilla-50 border border-vanilla-100 flex items-center justify-center text-gold-600 mb-6">
                                        <LeafIcon />
                                    </div>
                                    <h3 className="font-display text-2xl text-jungle-950 italic mb-4">Engagement Durable</h3>
                                    <p className="text-sm leading-relaxed">
                                        Nous luttons activement contre le réchauffement climatique et protégeons la biodiversité malgache tout en participant à l&apos;économie locale par la création d&apos;emplois à Nosy-Be.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="font-display text-4xl text-jungle-950 italic">Culture & Qualité</h2>
                                <p>
                                    Notre vanille 100% naturelle et non OGM est cultivée en altitude. Chaque étape est réalisée à la main : de la pollinisation manuelle à la récolte, suivie d&apos;un processus de séchage et d&apos;affinage rigoureusement maîtrisé pour garantir un arôme riche, raffiné et une fragrance stable.
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 p-1 rounded-[3rem] bg-gradient-to-br from-gold-500/30 to-vanilla-300">
                            <div className="rounded-[2.8rem] bg-jungle-900 p-10 lg:p-16 text-center text-vanilla-50 relative overflow-hidden">
                                <div className="absolute inset-0 shine opacity-10"></div>
                                <h3 className="font-display text-3xl sm:text-4xl italic mb-6">Prêt à goûter l&apos;excellence ?</h3>
                                <p className="text-vanilla-100/70 mb-10 max-w-lg mx-auto">Découvrez notre gamme complète de vanille TK Noir et Gourmet directement depuis Nosy-Be.</p>
                                <Link href="/shop" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition-all">
                                    Accéder à la boutique
                                    <ArrowRightIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
