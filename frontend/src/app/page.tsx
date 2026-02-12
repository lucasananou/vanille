'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { CATALOG } from '@/lib/products-data';

const SparklesIcon = () => (
  <svg className="w-4 h-4 text-gold-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CompassIcon = () => (
  <svg className="w-5 h-5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

const LeafIcon = () => (
  <svg className="w-5 h-5 text-gold-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.1.4 8.7-1.2 3.5-4 5.4-7.8 5.7L11 20z" />
    <path d="M11 20c0-3.3 4.3-4.6 11-7" />
  </svg>
);

const ShieldStarIcon = () => (
  <svg className="w-6 h-6 text-jungle-800" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m12 7-1.2 2.4-2.8.4 2 2-0.5 2.7 2.5-1.3 2.5 1.3-0.5-2.7 2-2-2.8-.4z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg className="w-6 h-6 text-jungle-800" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

const FlaskIcon = () => (
  <svg className="w-6 h-6 text-jungle-800" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6" />
    <path d="M10 3v3.4C10 7.5 8.6 8.7 8.2 9.4c-0.9 1.4-1.4 3.1-1.4 4.8c0 4.3 3.5 7.8 7.8 7.8s7.8-3.5 7.8-7.8c0-1.7-0.5-3.4-1.4-4.8c-0.4-0.7-1.8-1.9-1.8-3V3" />
    <path d="M8.5 14h7" />
  </svg>
);

const SilverwareIcon = () => (
  <svg className="w-6 h-6 text-jungle-800" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const DiamondsIcon = () => (
  <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

const RulerIcon = () => (
  <svg className="w-6 h-6 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0l12.6 12.6Z" />
    <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.89 4.312 3.633 11.57a1.001 1.001 0 0 0 1.414 0l7.258-7.258a1.001 1.001 0 0 0 0-1.414l-7.258-7.258a1.001 1.001 0 0 0-1.414 0Z" />
    <path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-gold-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-5 h-5 text-gold-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4c0 3.5-1 4.4-2 5" />
    <path d="M13 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h4c0 3.5-1 4.4-2 5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-gold-500 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const VanillaIcon = () => (
  <svg className="w-6 h-6 text-gold-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="bg-jungle-900 text-vanilla-50 font-sans antialiased">
      <Header />
      <main id="content">
        {/* HERO */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#0a2c1d' }}>
          <div className="absolute inset-0 shine grain" aria-hidden="true"></div>

          {/* Decorative halos */}
          <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-gold-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]"></div>
          <div className="absolute -bottom-36 -right-28 w-[40rem] h-[40rem] rounded-full bg-vanilla-50/10 blur-3xl animate-[pulse_9s_ease-in-out_infinite]"></div>

          <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-16 lg:pt-20 lg:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Copy */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 border border-vanilla-100/10">
                  <SparklesIcon />
                  <span className="text-sm font-semibold">Nosy-Be • Madagascar</span>
                  <span className="text-sm text-vanilla-100/70">• Arôme intense & raffiné</span>
                </div>

                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                  La vanille qui{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-vanilla-100 to-gold-600">transforme</span>{" "}
                  vos desserts.
                </h1>

                <p className="mt-5 text-lg text-vanilla-100/80 max-w-xl">
                  Gousses sélectionnées (TK Noir / Gourmet selon lots), conditionnement premium,
                  pensées pour la pâtisserie, l’extrait maison et les cadeaux gourmands.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                    Découvrir la boutique
                    <ArrowRightIcon />
                  </Link>
                  <Link href="#collection" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold glass hover:bg-vanilla-50/10 transition rm-anim focus-ring">
                    Voir la sélection
                    <CompassIcon />
                  </Link>
                </div>

                {/* Micro trust row */}
                <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-xl">
                  <div className="rounded-2xl glass p-4 border border-vanilla-100/10">
                    <p className="text-xs text-vanilla-100/70">Qualité</p>
                    <p className="mt-1 font-semibold">TK Noir / Gourmet</p>
                  </div>
                  <div className="rounded-2xl glass p-4 border border-vanilla-100/10">
                    <p className="text-xs text-vanilla-100/70">Conditionnement</p>
                    <p className="mt-1 font-semibold">Sous-vide / Tube</p>
                  </div>
                  <div className="rounded-2xl glass p-4 border border-vanilla-100/10">
                    <p className="text-xs text-vanilla-100/70">Tailles</p>
                    <p className="mt-1 font-semibold">10–18 cm</p>
                  </div>
                </div>
              </div>

              {/* Visual block */}
              <div className="relative">
                <div className="rounded-[28px] border border-vanilla-100/15 overflow-hidden bg-gradient-to-b from-vanilla-50/10 to-jungle-900/10">
                  <div className="aspect-[4/3] relative">
                    <img
                      src="/photos produit vanille/Galerie photos qui sommes nous/Triage et calibrage.jpg"
                      alt="Triage et calibrage de la vanille MSV Nosy-Be"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jungle-900/40 via-transparent to-transparent"></div>

                    {/* Floating chips */}
                    <div className="absolute inset-0 p-5">
                      <div className="absolute top-5 left-5 rounded-2xl bg-jungle-900/90 backdrop-blur-sm px-4 py-3 border border-vanilla-100/10 animate-float shadow-lg">
                        <p className="text-xs text-vanilla-100/70">Profil</p>
                        <p className="text-sm font-semibold text-vanilla-50">Gourmand • Chaud • Floral</p>
                      </div>
                      <div className="absolute bottom-5 left-5 rounded-2xl bg-jungle-900/90 backdrop-blur-sm px-4 py-3 border border-vanilla-100/10 animate-float [animation-delay:-1.3s] shadow-lg">
                        <p className="text-xs text-vanilla-100/70">Origine</p>
                        <p className="text-sm font-semibold text-vanilla-50">Terroir de Nosy-Be</p>
                      </div>
                      <div className="absolute bottom-5 right-5 rounded-2xl bg-gradient-to-b from-gold-500 to-gold-600 text-jungle-900 px-4 py-3 animate-float [animation-delay:-2.1s]">
                        <p className="text-xs/none font-semibold">Sélection</p>
                        <p className="text-sm font-extrabold mt-1">TK Noir / Gourmet</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-vanilla-100/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 text-gold-500">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </span>
                        <p className="text-sm text-vanilla-100/80 leading-snug">
                          Éclat naturel, souplesse préservée.
                        </p>
                      </div>
                      <Link href="#signature" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold hover:underline focus-ring rounded-full px-3 py-2 text-white">
                        Voir la signature
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE */}
        <section id="signature" className="bg-vanilla-50 text-cacao-900">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-cacao-800/80">
                  <LeafIcon />
                  Signature MSV Nosy-Be
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                  Une vanille <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-cacao-900">exigeante</span>.
                  Un rendu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cacao-900 to-gold-600">inoubliable</span>.
                </h2>
                <p className="mt-4 text-cacao-600 max-w-2xl">
                  Ici, on vend une sensation : l’odeur, la chaleur, le “wow” à l’ouverture du tube.
                  L'excellence de Madagascar directement dans votre cuisine.
                </p>
              </div>

              <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                Voir les produits
              </Link>
            </div>

            <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { icon: <ShieldStarIcon />, title: "Sélection qualité", desc: "TK (Noir) / Gourmet selon lots. Tri + contrôle rigoureux." },
                { icon: <ArchiveIcon />, title: "Conservation premium", desc: "Sous-vide pour la stabilité, tube pour l’expérience cadeau." },
                { icon: <FlaskIcon />, title: "Riche en arômes", desc: "Un parfum chaud & intense, idéal pour la haute pâtisserie." },
                { icon: <SilverwareIcon />, title: "Pensée cuisine", desc: "Pâtisserie, glaces, rhum arrangé, extrait maison." }
              ].map((item, idx) => (
                <article key={idx} className="rounded-xxl bg-white border border-vanilla-200 p-6 hover:border-gold-500/30 transition rm-anim">
                  <div className="w-12 h-12 rounded-2xl bg-vanilla-100 border border-vanilla-200 grid place-items-center">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-display text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-cacao-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COLLECTION (Initial position, can be kept or removed if redundant) */}
        <section id="collection" className="relative bg-jungle-900">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-vanilla-100/80">
                  <DiamondsIcon />
                  Collection
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">Choisis ta longueur. Ressens la différence.</h2>
                <p className="mt-4 text-vanilla-100/75 max-w-2xl">
                  Plus c’est long, plus c’est premium. Une sélection rigoureuse pour tous les usages.
                </p>
              </div>

              <div className="flex lg:justify-end">
                <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                  Aller à la boutique
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {CATALOG.slice(0, 4).map((p) => (
                <article key={p.id} className="group rounded-xxl border border-vanilla-100/12 bg-vanilla-50/5 hover:bg-vanilla-50/10 transition rm-anim overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-vanilla-100/70">{p.size}</p>
                        <h3 className="mt-2 font-display text-2xl text-white">{p.grade}</h3>
                        <p className="mt-2 text-sm text-vanilla-100/75">{p.subtitle}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-vanilla-50/10 border border-vanilla-100/12 grid place-items-center">
                        {p.size.includes('10') ? <RulerIcon /> : <StarIcon />}
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2 text-sm text-vanilla-100/80">
                      {p.bullets.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircleIcon />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex gap-3">
                      <Link href={`/produit/${p.id}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-50/10 border border-vanilla-100/12 hover:bg-vanilla-50/15 focus-ring text-white">
                        Voir
                      </Link>
                      <Link href={`/produit/${p.id}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 focus-ring">
                        Acheter
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TERROIR */}
        <section id="terroir" className="bg-vanilla-50 text-cacao-900">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-cacao-800/80">
                  <MapPinIcon />
                  Terroir & histoire
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl">Nosy-Be, l’île qui parfume tout.</h2>
                <p className="mt-4 text-cacao-600">
                  Un climat unique, un savoir-faire transmis de génération en génération.
                  Chaque gousse MSV Nosy-Be porte en elle l'exotisme et la pureté de Madagascar.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xxl bg-white border border-vanilla-200 p-5">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-5 h-5 text-jungle-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </span>
                      Filière & engagement
                    </p>
                    <p className="mt-2 text-sm text-cacao-600">Soutenir les planteurs locaux et garantir une qualité constante.</p>
                  </div>
                  <div className="rounded-xxl bg-white border border-vanilla-200 p-5">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-5 h-5 text-jungle-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </span>
                      Affinage
                    </p>
                    <p className="mt-2 text-sm text-cacao-600">Plusieurs mois de patience pour un profil aromatique d'exception.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-cacao-900 bg-white border border-vanilla-200 hover:bg-vanilla-100 transition rm-anim focus-ring">
                    Lire l’histoire
                  </Link>
                  <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                    Acheter maintenant
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[28px] bg-jungle-900 text-vanilla-50 border border-jungle-800 overflow-hidden">
                  <div className="p-6">
                    <p className="text-sm font-semibold text-white/80">Le process</p>
                    <h3 className="mt-2 font-display text-2xl text-white">De la fleur au tube.</h3>
                  </div>
                  <div className="px-6 pb-6 grid gap-3">
                    {[
                      { title: "Pollinisation & récolte", desc: "Un geste précis, une fois par an." },
                      { title: "Étuvage & séchage", desc: "Le secret de la couleur et du parfum." },
                      { title: "Tri & sélection", desc: "Seules les meilleures gousses sont retenues." }
                    ].map((step, i) => (
                      <div key={i} className="rounded-2xl bg-vanilla-50/7 border border-vanilla-100/12 p-4">
                        <p className="text-sm font-semibold flex items-center gap-2 text-white">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 21.5c-3.5 0-6.5-3-6.5-6.5 0-1.5.5-3 1.5-4.5C8 8 10 6.5 12 6.5c2 0 4 1.5 5.5 4 1 1.5 1.5 3 1.5 4.5 0 3.5-3 6.5-6.5 6.5z" />
                          </svg>
                          {step.title}
                        </p>
                        <p className="mt-2 text-sm text-vanilla-100/75">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="avis" className="bg-jungle-900">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-vanilla-100/80">
                  <QuoteIcon />
                  Preuve sociale
                </p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">Quand la vanille devient une addiction.</h2>
              </div>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                { text: "“Parfum incroyable. On sent la différence dès la première crème.”", author: "Client(e) #1", category: "Pâtisserie maison" },
                { text: "“Le tube fait vraiment cadeau premium. Service impeccable.”", author: "Client(e) #2", category: "Cadeau gourmand" },
                { text: "“Idéal pour extrait maison. Résultat puissant, très rond.”", author: "Client(e) #3", category: "Extrait / rhum arrangé" }
              ].map((review, idx) => (
                <article key={idx} className="rounded-xxl glass p-6 border border-vanilla-100/10 hover:bg-vanilla-50/5 transition rm-anim">
                  <p className="text-sm text-vanilla-100/85">{review.text}</p>
                  <p className="mt-4 text-sm font-semibold text-white">— {review.author}</p>
                  <p className="text-xs text-vanilla-100/60 mt-1">{review.category}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NEW PRODUCTS SECTION - UNDER REVIEWS */}
        <section className="relative text-jungle-900 overflow-hidden py-16 lg:py-24" style={{ backgroundImage: "url('/bg-vanille.jpg')", backgroundSize: 'cover', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-jungle-900/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-jungle-800 border border-jungle-900/10 mb-4">
                  <SparklesIcon />
                  Notre Sélection
                </div>
                <h2 className="font-display text-3xl sm:text-4xl italic">Nos Meilleures Gousses</h2>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors">
                Voir tout le catalogue
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {CATALOG.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/produit/${p.id}`}
                  className="group rounded-[2rem] bg-white border border-vanilla-200 p-2 hover:border-gold-500/30 transition-all duration-500 overflow-hidden"
                >
                  <div className="relative aspect-square rounded-[1.6rem] bg-vanilla-50 flex items-center justify-center overflow-hidden border border-vanilla-100">
                    <div className="absolute inset-0 bg-gradient-to-tr from-vanilla-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-jungle-800 border border-vanilla-100">
                        {p.grade}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl text-jungle-950 group-hover:text-gold-600 transition-colors uppercase tracking-tight">{p.title}</h3>
                      <ArrowRightIcon />
                    </div>
                    <p className="text-sm text-jungle-700/70 line-clamp-1 mb-4">{p.subtitle}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-vanilla-100">
                      <p className="font-display text-xl text-jungle-950">
                        {p.price_label === '—' ? 'Sur demande' : (p.price_label === 'Devis' ? 'Prix Pro' : `${p.price_label}€`)}
                      </p>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600 group-hover:translate-x-1 transition-transform">Détails</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-jungle-900" aria-hidden="true"></div>
          <div className="absolute inset-0 grain opacity-60" aria-hidden="true"></div>

          <div className="relative mx-auto max-w-7xl px-4 py-16">
            <div className="rounded-[28px] border border-vanilla-100/12 bg-gradient-to-b from-vanilla-50/8 to-vanilla-50/4 overflow-hidden">
              <div className="p-8 lg:p-12 grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-vanilla-100/80">
                    <SparklesIcon />
                    Prêt à passer au niveau au-dessus ?
                  </p>
                  <h2 className="mt-3 font-display text-3xl sm:text-4xl text-white">
                    Faites sentir la vanille <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-vanilla-100">avant</span> même de goûter.
                  </h2>
                  <p className="mt-4 text-vanilla-100/75">
                    Cliquez, choisissez votre longueur, et recevez une vanille qui change tout.
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-jungle-900 bg-gradient-to-b from-gold-500 to-gold-600 hover:opacity-90 transition rm-anim focus-ring">
                      Acheter maintenant
                      <ArrowRightIcon />
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold glass hover:bg-vanilla-50/10 transition rm-anim focus-ring text-white">
                      Besoin d’un conseil ?
                    </Link>
                  </div>
                </div>

                <div className="rounded-xxl bg-vanilla-50/6 border border-vanilla-100/12 p-6">
                  <p className="text-sm font-semibold text-vanilla-50">L'excellence au quotidien :</p>
                  <ul className="mt-4 space-y-3 text-sm text-vanilla-100/80">
                    <li className="flex gap-2"><CheckCircleIcon /><span>Gousses fraîches & souples.</span></li>
                    <li className="flex gap-2"><CheckCircleIcon /><span>Arôme intense & persistant.</span></li>
                    <li className="flex gap-2"><CheckCircleIcon /><span>Origine garantie Nosy-Be.</span></li>
                    <li className="flex gap-2"><CheckCircleIcon /><span>Expédition rapide & soignée.</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
