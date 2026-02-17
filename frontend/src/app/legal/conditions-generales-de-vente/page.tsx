'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';

export default function CGVPage() {
    return (
        <div className="flex flex-col min-h-screen bg-vanilla-50 text-jungle-950 font-sans antialiased">
            <Header />

            <main className="flex-grow py-16 lg:py-24">
                <div className="mx-auto max-w-4xl px-4">
                    <h1 className="font-display text-4xl sm:text-5xl italic leading-tight mb-12 text-center text-jungle-900">
                        Conditions Générales de Vente <br />
                        <span className="text-jungle-700/60 text-2xl not-italic">General Terms and Conditions of Sale</span>
                    </h1>

                    <div className="space-y-16 bg-white shadow-xl p-8 sm:p-12 rounded-[2rem] border border-vanilla-200 text-sm leading-relaxed text-jungle-800">
                        {/* Article 1 */}
                        <section className="grid sm:grid-cols-2 gap-8 border-b border-vanilla-100 pb-12">
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 1 – Parties (FR)</h2>
                                <p>La société MORIDY SOANJARA VANILLE NOSY-BE (M.S.V – NOSY BE), SARL de droit malgache.</p>
                                <ul className="mt-2 space-y-1">
                                    <li>Siège social : Lot n°109B 0163 à Befitina, Hell-Ville, Nosy-Be, Madagascar</li>
                                    <li>Tél : +261 32 98 595 50</li>
                                    <li>Immatriculée : RCS Nosy-Be 2023 B 00054</li>
                                    <li>STAT : 46101 71 2023 0 10373</li>
                                    <li>Représentée par : ABOU MORIDY, Directeur Général</li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 1 – Parties (EN)</h2>
                                <p>MORIDY SOANJARA VANILLA NOSY-BE (M.S.V – NOSY BE), a limited liability company under Malagasy law.</p>
                                <ul className="mt-2 space-y-1 text-jungle-600">
                                    <li>Registered office: Lot No. 109B 0163, Befitina, Hell-Ville, Nosy-Be, Madagascar</li>
                                    <li>Phone: +261 32 98 595 50</li>
                                    <li>Registered under No.: RCS Nosy-Be 2023 B 00054</li>
                                    <li>STAT No.: 46101 71 2023 0 10373</li>
                                    <li>Represented by: ABOU MORIDY, Managing Director</li>
                                </ul>
                            </div>
                        </section>

                        {/* Article 2 */}
                        <section className="grid sm:grid-cols-2 gap-8 border-b border-vanilla-100 pb-12">
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 2 – Objet (FR)</h2>
                                <p>Définir les conditions de commercialisation, coordination, assistance logistique et facilitation à l&apos;exportation de vanille naturelle originaire de Nosy Be. Toute commande implique l&apos;acceptation pleine et entière des présentes CGV.</p>
                            </div>
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 2 – Purpose (EN)</h2>
                                <p className="text-jungle-600">Define the terms under which M.S.V – Nosy Be markets and facilitates the export of natural vanilla. Any order implies full and unconditional acceptance of these GTC.</p>
                            </div>
                        </section>

                        {/* Article 4 & 5 Highlights */}
                        <section className="bg-vanilla-50 p-6 rounded-2xl border border-gold-600/10">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4 text-xs">Paiement & Prix</h2>
                                    <p className="font-semibold text-jungle-900 mb-2">Acompte de 30% à la commande.</p>
                                    <p className="mb-4 italic opacity-70 border-l-2 border-gold-500 pl-4">Solde de 70% avant expédition.</p>
                                    <p className="text-lg font-display text-gold-600">267,555 € / kg</p>
                                </div>
                                <div className="text-jungle-600">
                                    <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4 text-xs">Payment & Price</h2>
                                    <p className="font-semibold text-jungle-900 mb-2">30% deposit upon confirmation.</p>
                                    <p className="mb-4 italic opacity-70 border-l-2 border-gold-500 pl-4">70% balance before shipment.</p>
                                    <p className="text-lg font-display text-gold-600">€267.555 / kg</p>
                                </div>
                            </div>
                        </section>

                        {/* Article 14 */}
                        <section className="grid sm:grid-cols-2 gap-8 border-b border-vanilla-100 pb-12">
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 14 – Prix de vente global de référence (FR)</h2>
                                <p>Le prix de vente global de référence est fixé à 267,555 € / kg, incluant l’ensemble des coûts directs et indirects liés à la production, à la transformation, à la conservation, à la logistique, à l’exportation ainsi qu’aux obligations réglementaires. Ce prix est pleinement et objectivement justifié sur le plan économique.</p>
                            </div>
                            <div>
                                <h2 className="text-gold-600 font-bold uppercase tracking-wider mb-4">Article 14 – Global Reference Selling Price (EN)</h2>
                                <p className="text-jungle-600">The global reference selling price is set at €267.555 / kg, including all direct and indirect costs related to production, processing, storage, logistics, export, and regulatory obligations. This price is fully and objectively justified on economic grounds.</p>
                            </div>
                        </section>

                        <div className="text-center pt-12">
                            <p className="text-xs uppercase tracking-widest text-jungle-400">Fait à Nosy Be – Madagascar, le 29 décembre 2025</p>
                            <p className="mt-4 font-display text-xl text-gold-600 italic">ABOU MORIDY</p>
                            <p className="text-xs opacity-60">Directeur Général / Managing Director</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
