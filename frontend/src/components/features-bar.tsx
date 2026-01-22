'use client';

export default function FeaturesBar() {
    const features = [
        {
            title: "Expédition Rapide",
            description: "Expédition sous 24/48h",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        },
        {
            title: "Paiement Sécurisé",
            description: "100% sécurisé via Stripe/PayPal",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            title: "Retours Simples",
            description: "Satisfait ou remboursé sous 14j",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            )
        },
        {
            title: "Service Client",
            description: "Disponible 5j/7 par chat/email",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        }
    ];

    return (
        <div className="border-t border-b border-zinc-100 bg-zinc-50/50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <h2 className="sr-only">Nos Engagements</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-100">
                                {feature.icon}
                            </div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
                                {feature.title}
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500 font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
