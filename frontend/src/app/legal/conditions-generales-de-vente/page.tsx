'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLocale } from '@/lib/locale-context';
import { CGV_FR, CGV_EN, type CgvContent } from '@/lib/data/cgv';

function Blocks({ items }: { items: CgvContent['articles'][number]['c'] }) {
    return (
        <>
            {items.map((item, i) =>
                Array.isArray(item) ? (
                    <ul key={i} className="mt-2 ml-1 space-y-1.5">
                        {item.map((li, j) => (
                            <li key={j} className="flex gap-2">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                                <span>{li}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p key={i} className="mt-3 first:mt-0">{item}</p>
                ),
            )}
        </>
    );
}

export default function CGVPage() {
    const { locale } = useLocale();
    const cgv: CgvContent = locale === 'en' ? CGV_EN : CGV_FR;

    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-jungle-950 font-sans antialiased">
            <Header />

            <main className="flex-grow py-16 lg:py-24">
                <div className="mx-auto max-w-4xl px-4">
                    <header className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold-600">
                            {locale === 'en' ? '2026 Version' : 'Version 2026'}
                        </p>
                        <h1 className="mt-3 font-display text-4xl sm:text-5xl italic leading-tight text-jungle-900">
                            {cgv.title}
                        </h1>
                        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-jungle-500">{cgv.subtitle}</p>
                    </header>

                    <div className="mt-12 rounded-[2rem] border border-vanilla-200 bg-white p-6 shadow-xl sm:p-10 text-sm leading-relaxed text-jungle-800">
                        {/* Parties */}
                        <section className="border-b border-vanilla-100 pb-8">
                            <Blocks items={cgv.intro} />
                        </section>

                        {/* Articles */}
                        <div className="mt-8 space-y-8">
                            {cgv.articles.map((article) => (
                                <section key={article.t} className="scroll-mt-24">
                                    <h2 className="font-display text-lg text-gold-700">{article.t}</h2>
                                    <div className="mt-2">
                                        <Blocks items={article.c} />
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Signature */}
                        <div className="mt-12 border-t border-vanilla-100 pt-8 text-center">
                            {cgv.signature.map((line, i) => (
                                <p key={i} className={i === 0 ? 'text-xs uppercase tracking-widest text-jungle-400' : 'mt-2 text-jungle-700'}>
                                    {line}
                                </p>
                            ))}
                            <p className="mt-6 text-[11px] uppercase tracking-widest text-jungle-400">{cgv.footerNote}</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
