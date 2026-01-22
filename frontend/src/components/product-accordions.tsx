'use client';

import { useState } from 'react';

const ACCORDION_ITEMS = [
    {
        title: 'Détails Produit & Coupe',
        content: (
            <ul className="space-y-2 list-none text-zinc-600">
                <li><span className="font-semibold text-zinc-900">Composition :</span> 95% Viscose, 5% Élasthanne (Tissu premium)</li>
                <li><span className="font-semibold text-zinc-900">Opacité :</span> 100% Opaque (pas besoin de doublure supplémentaire)</li>
                <li><span className="font-semibold text-zinc-900">Doublure :</span> Oui, sur la partie haute pour plus de confort</li>
                <li><span className="font-semibold text-zinc-900">Tissu :</span> Fluide, doux et légèrement stretch</li>
                <li><span className="font-semibold text-zinc-900">Coupe :</span> Ajustée au buste, évasée aux hanches</li>
                <li><span className="font-semibold text-zinc-900">Longueur :</span> 115cm (Taille S) - Arrive mi-mollet</li>
                <li><span className="font-semibold text-zinc-900">Saison :</span> Idéal Mi-saison & Été (respirant)</li>
                <li><span className="font-semibold text-zinc-900">Origine :</span> Designé à Paris, Fabriqué en Europe 🇪🇺</li>
            </ul>
        )
    },
    {
        title: 'Questions Fréquentes (FAQ)',
        content: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs mb-1">Est-ce que ça taille petit ?</h4>
                    <p>Non, ce modèle taille normalement. Prenez votre taille habituelle. Si vous êtes entre deux tailles, privilégiez celle du dessus pour plus de confort.</p>
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs mb-1">Est-ce que c’est transparent ?</h4>
                    <p>Absolument pas ! Le tissu a été sélectionné pour son opacité totale, même en plein soleil. Vous pouvez la porter en toute confiance.</p>
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs mb-1">Ça gratte ?</h4>
                    <p>Au contraire, la viscose est une matière naturelle ultra-douce. C'est comme une seconde peau, idéal pour les peaux sensibles.</p>
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-xs mb-1">Peut se porter en hiver ?</h4>
                    <p>Oui, avec des collants et un gros pull maille ou un cardigan, elle est parfaite pour l'hiver grâce à son étoffe de qualité.</p>
                </div>
            </div>
        )
    },
    { title: 'Livraison & Frais', content: 'Livraison standard offerte dès 75€. \n• France : 2-4 jours ouvrés \n• International : 5-8 jours ouvrés \n• Suivi de colis inclus.' },
    { title: 'Retours & Échanges', content: 'Vous avez 30 jours pour changer d\'avis. \n• Retours gratuits via Point Relais \n• Remboursement sous 5 jours après réception.' },
    { title: 'Entretien', content: 'Prenez soin de vos pièces : \n• Lavage à 30° cycle délicat \n• Repassage doux sur l\'envers \n• Séchage naturel (pas de sèche-linge)' }
];


export default function ProductAccordions() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="border-t border-zinc-100 mt-4">
            {ACCORDION_ITEMS.map((item, idx) => (
                <div key={idx} className="border-b border-zinc-100">
                    <button
                        onClick={() => toggleAccordion(idx)}
                        className="w-full py-4 flex justify-between items-center group cursor-pointer hover:bg-zinc-50/50 px-2 transition-colors text-left"
                    >
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900">{item.title}</h2>
                        <svg
                            className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-2 pb-6">
                            <div className="text-sm text-zinc-600 font-medium leading-relaxed whitespace-pre-line">
                                {item.content}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
