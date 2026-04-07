'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { withLocale } from '@/lib/i18n';

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
    const { locale } = useLocale();
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
                                    <span className="text-sm font-semibold uppercase tracking-widest">{locale === 'en' ? 'Our Story • M.S.V-NOSY BE' : 'Notre Histoire • M.S.V-NOSY BE'}</span>
                                </div>

                                <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-7xl italic leading-tight text-vanilla-50">
                                    {locale === 'en' ? <>From the soils of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Nosy-Be</span> to your table.</> : <>De la terre de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">Nosy-Be</span> à votre assiette.</>}
                                </h1>
                                <p className="mt-6 text-xl text-vanilla-100/80 leading-relaxed max-w-xl">
                                    {locale === 'en' ? 'More than a spice, it is a pursuit of excellence. Discover how we select and cure some of Madagascar’s finest vanilla.' : 'Plus qu&apos;une épice, une passion pour l&apos;excellence. Découvrez comment nous sélectionnons et affinons la meilleure vanille de Madagascar.'}
                                </p>

                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <Link href={withLocale('/shop', locale)} className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition-all">
                                        {locale === 'en' ? 'Visit the shop' : 'Voir la boutique'}
                                        <ArrowRightIcon />
                                    </Link>
                                    <Link href={withLocale('/contact', locale)} className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold glass hover:bg-vanilla-50/10 transition-all text-vanilla-50">
                                        {locale === 'en' ? 'Contact us' : 'Nous contacter'}
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="rounded-[3rem] border border-vanilla-100/10 bg-vanilla-50/5 overflow-hidden p-3 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] relative">
                                    <div className="w-full h-full rounded-[2.5rem] bg-jungle-950/40 relative overflow-hidden">
                                        <img
                                            src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/pdg-sur-le-terrain.jpg"
                                            alt="L'art de l'affinage"
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative text-center px-8">
                                                <p className="font-display text-3xl italic text-vanilla-50">{locale === 'en' ? 'The art of curing' : 'L&apos;art de l&apos;affinage'}</p>
                                                <p className="mt-4 text-sm text-vanilla-100/60 max-w-xs">{locale === 'en' ? 'Every batch is inspected, smelled and selected with uncompromising rigour.' : 'Chaque lot est scruté, senti et sélectionné avec une rigueur absolue.'}</p>
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
                                <h2 className="font-display text-4xl text-jungle-950 italic">{locale === 'en' ? 'The origin of Bourbon vanilla' : 'L&apos;Origine de la Vanille Bourbon'}</h2>
                                <p>
                                    {locale === 'en' ? 'Born on the island of Nosy-Be, where vanilla was first introduced to Madagascar in 1880, Vanille Moridy® embodies the very origin of Bourbon vanilla. Shaped by volcanic soils, marine breezes and generations of expertise, each pod expresses a naturally intense aroma and remarkable sensory depth.' : 'Née sur l’île de Nosy-Be, là où la vanille fut introduite pour la première fois à Madagascar en 1880, Vanille Moridy® incarne l’origine même de la vanille Bourbon. Façonnée par un terroir volcanique, les brises marines et des générations de savoir-faire, chaque gousse exprime un arôme naturellement intense et une profondeur sensorielle remarquable.'}
                                </p>
                                <p>
                                    {locale === 'en' ? 'Carefully cultivated, harvested at full maturity and slowly cured according to traditional methods, Vanille Moridy® reveals a warm, rounded and elegant aromatic profile. It is a vanilla of character and authenticity, created for chefs, artisans and brands seeking excellence, emotion and origin in every creation.' : 'Cultivée avec soin, récoltée à pleine maturité et affinée lentement selon des méthodes traditionnelles, Vanille Moridy® révèle un profil aromatique chaud, rond et élégant. C’est une vanille de caractère et d’authenticité, créée pour les chefs, artisans et marques en quête d’excellence, d’émotion et d’origine dans chacune de leurs créations.'}
                                </p>
                                <p className="italic font-display text-2xl text-gold-600 border-l-2 border-gold-500 pl-6">
                                    {locale === 'en' ? 'Vanille Moridy® is more than vanilla — it is the expression of Nosy-Be heritage.' : 'Vanille Moridy® est plus qu’une vanille — c’est l’expression du patrimoine de Nosy-Be.'}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8 py-8">
                                <div className="rounded-[2rem] bg-white border border-vanilla-200 p-8 shadow-sm">
                                    <h3 className="font-display text-2xl text-jungle-950 italic mb-4">{locale === 'en' ? 'Technical excellence' : 'Excellence Technique'}</h3>
                                    <p className="text-sm leading-relaxed mb-4">
                                        {locale === 'en' ? 'Vanille Moridy® stands out for its naturally high aromatic concentration and strict quality control throughout the supply chain.' : 'Vanille Moridy® se distingue par une concentration aromatique naturellement élevée et un contrôle qualité strict tout au long de la chaîne d’approvisionnement.'}
                                    </p>
                                    <p className="text-sm leading-relaxed text-jungle-700">
                                        {locale === 'en' ? 'Our production relies on controlled agricultural practices, ensuring consistency, uniformity and aromatic integrity.' : 'Notre production repose sur des pratiques agricoles maîtrisées, garantissant stabilité, homogénéité et intégrité aromatique.'}
                                    </p>
                                </div>
                                <div className="rounded-[2rem] bg-white border border-vanilla-200 p-8 shadow-sm">
                                    <h3 className="font-display text-2xl text-jungle-950 italic mb-4">{locale === 'en' ? 'Quality & traceability' : 'Qualité & Traçabilité'}</h3>
                                    <p className="text-sm leading-relaxed mb-4">
                                        {locale === 'en' ? 'Designed to meet the technical and traceability expectations of the most demanding international partners.' : 'Répond aux exigences techniques et de traçabilité des partenaires internationaux les plus exigeants au monde.'}
                                    </p>
                                    <p className="text-sm leading-relaxed text-jungle-700">
                                        {locale === 'en' ? 'Intended for premium food applications, flavour houses and high-performance extracts.' : 'Destinée aux applications alimentaires premium, aux arômes et aux extraits de haute performance.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="font-display text-4xl text-jungle-950 italic">{locale === 'en' ? 'Cultivation & quality' : 'Culture & Qualité'}</h2>
                                <p>
                                    {locale === 'en' ? 'Our 100% natural, non-GMO vanilla is cultivated at altitude. Every step is performed by hand, from pollination to harvest, followed by a carefully controlled curing and maturation process to ensure a rich, refined aroma and lasting fragrance.' : 'Notre vanille 100% naturelle et non OGM est cultivée en altitude. Chaque étape est réalisée à la main : de la pollinisation manuelle à la récolte, suivie d&apos;un processus de séchage et d&apos;affinage rigoureusement maîtrisé pour garantir un arôme riche, raffiné et une fragrance stable.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 p-1 rounded-[3rem] bg-gradient-to-br from-gold-500/30 to-vanilla-300">
                            <div className="rounded-[2.8rem] bg-jungle-900 p-10 lg:p-16 text-center text-vanilla-50 relative overflow-hidden">
                                <div className="absolute inset-0 shine opacity-10"></div>
                                <h3 className="font-display text-3xl sm:text-4xl italic mb-6">{locale === 'en' ? 'Ready to taste excellence?' : 'Prêt à goûter l&apos;excellence ?'}</h3>
                                <p className="text-vanilla-100/70 mb-10 max-w-lg mx-auto">{locale === 'en' ? 'Discover our full range of Black TK and Gourmet vanilla directly from Nosy-Be.' : 'Découvrez notre gamme complète de vanille TK Noir et Gourmet directement depuis Nosy-Be.'}</p>
                                <Link href={withLocale('/shop', locale)} className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition-all">
                                    {locale === 'en' ? 'Enter the shop' : 'Accéder à la boutique'}
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
