'use client';

export default function TestimonialsSection() {
    const reassuranceItems = [
        {
            title: 'Qualité contrôlée',
            content: 'Gousses sélectionnées pour leur souplesse, leur brillance et leur profondeur aromatique avant expédition.',
        },
        {
            title: 'Commandes suivies',
            content: 'Préparation sous 24–48h, livraison France et international, puis suivi de commande communiqué au client.',
        },
        {
            title: 'Contact direct',
            content: 'WhatsApp et email restent disponibles pour choisir le bon format, valider un délai ou préparer une demande professionnelle.',
        },
    ];

    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-[#a1b8ff]">
                        Réassurance
                    </span>
                    <h2 className="text-4xl font-serif text-zinc-900">
                        Des repères clairs <span className="italic text-[#a1b8ff]">avant achat</span>
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {reassuranceItems.map((item) => (
                        <div key={item.title} className="flex flex-col items-center text-center p-8 bg-zinc-50 rounded-sm">
                            <div className="flex gap-1 mb-4 text-[#a1b8ff]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-zinc-900 mb-2">{item.title}</h3>
                            <p className="text-zinc-600 font-light mb-6">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
