import Header from '@/components/header';
import Footer from '@/components/footer';

export default function SizeGuidePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white text-zinc-900">
            <Header />
            <main className="flex-grow mx-auto max-w-4xl w-full px-6 py-16">
                <h1 className="text-4xl font-serif mb-8 text-center">Guide des Tailles</h1>

                <div className="prose prose-zinc max-w-none space-y-16">
                    <section>
                        <h2 className="text-2xl font-serif border-b border-zinc-100 pb-4">Comment prendre vos mesures</h2>
                        <p className="text-zinc-500 font-light leading-relaxed">
                            Pour choisir la taille idéale, nous vous recommandons de prendre vos mesures directement sur le corps, à l'aide d'un mètre ruban, sans trop serrer.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-8 mt-8">
                            <div className="bg-zinc-50 p-6 rounded">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">1. Poitrine</h4>
                                <p className="text-xs text-zinc-500 font-light">Mesurez horizontalement à l'endroit le plus fort de la poitrine.</p>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">2. Taille</h4>
                                <p className="text-xs text-zinc-500 font-light">Mesurez au creux de votre taille, au-dessus du nombril.</p>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">3. Hanches</h4>
                                <p className="text-xs text-zinc-500 font-light">Mesurez à l'endroit le plus large du bassin.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif border-b border-zinc-100 pb-4">Correspondance des tailles</h2>
                        <div className="overflow-x-auto mt-8">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-zinc-900 text-white">
                                        <th className="p-4 font-medium">Taille</th>
                                        <th className="p-4 font-medium">Standard FR</th>
                                        <th className="p-4 font-medium">Poitrine (cm)</th>
                                        <th className="p-4 font-medium">Taille (cm)</th>
                                        <th className="p-4 font-medium">Hanches (cm)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    <tr><td className="p-4 font-bold">S</td><td className="p-4 text-zinc-500">36</td><td className="p-4 text-zinc-500">84-88</td><td className="p-4 text-zinc-500">64-68</td><td className="p-4 text-zinc-500">90-94</td></tr>
                                    <tr><td className="p-4 font-bold">M</td><td className="p-4 text-zinc-500">38</td><td className="p-4 text-zinc-500">89-93</td><td className="p-4 text-zinc-500">69-73</td><td className="p-4 text-zinc-500">95-99</td></tr>
                                    <tr><td className="p-4 font-bold">L</td><td className="p-4 text-zinc-500">40</td><td className="p-4 text-zinc-500">94-98</td><td className="p-4 text-zinc-500">74-78</td><td className="p-4 text-zinc-500">100-104</td></tr>
                                    <tr><td className="p-4 font-bold">XL</td><td className="p-4 text-zinc-500">42</td><td className="p-4 text-zinc-500">99-103</td><td className="p-4 text-zinc-500">79-83</td><td className="p-4 text-zinc-500">105-109</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-[10px] text-zinc-400 italic italic">Note : Ces mesures sont indicatives et peuvent varier légèrement selon les modèles.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
