export interface VariantData {
    packaging: string;
    quantity: string;
    price: number;
}

export interface ProductData {
    id: string;
    title: string;
    subtitle: string;
    price_label: string;
    size: string;
    grade: string;
    packaging: string[];
    variants?: VariantData[];
    bullets: string[];
    images: string[];
}

export const CATALOG: ProductData[] = [
    {
        id: "tk-noir-10-13",
        title: "Vanille TK (Noir) — 10–13 cm",
        subtitle: "Arôme intense, usage quotidien",
        price_label: "À partir de 45€",
        size: "10–13 cm",
        grade: "TK (Noir)",
        packaging: ["Sous-vide"],
        variants: [
            { packaging: "Botte sous-vide", quantity: "50 gousses", price: 9000 },
            { packaging: "Botte sous-vide", quantity: "25 gousses", price: 4500 }
        ],
        bullets: ["Sélection TK (Noir) / Gourmet (selon lot)", "Vente uniquement par bottes (sous-vide)", "Idéal pour desserts, infusion, cuisine"],
        images: ["/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8423.jpg", "/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8450.jpg", "/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8456.jpg"]
    },
    {
        id: "tk-noir-14-15",
        title: "Vanille TK (Noir) — 14–15 cm",
        subtitle: "Équilibre longueur / puissance aromatique",
        price_label: "À partir de 5€",
        size: "14–15 cm",
        grade: "TK (Noir)",
        packaging: ["Tube", "Sous-vide"],
        variants: [
            { packaging: "Tube", quantity: "3 gousses", price: 500 },
            { packaging: "Botte sous-vide", quantity: "50 gousses", price: 9000 },
            { packaging: "Botte sous-vide", quantity: "20 gousses", price: 3600 },
            { packaging: "Botte sous-vide", quantity: "10 gousses", price: 1800 }
        ],
        bullets: ["Longueur polyvalente (pâtisserie, extrait maison)", "Vente en tube ou par bottes (sous-vide)", "Gousses souples, parfum gourmand"],
        images: ["/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg", "/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8394.jpg", "/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8415.jpg"]
    },
    {
        id: "tk-noir-16",
        title: "Vanille TK (Noir) — 16 cm",
        subtitle: "Pour pâtisserie fine & cadeaux gourmands",
        price_label: "À partir de 5€",
        size: "16 cm",
        grade: "TK (Noir)",
        packaging: ["Tube", "Sous-vide"],
        variants: [
            { packaging: "Tube", quantity: "2 gousses", price: 500 },
            { packaging: "Botte sous-vide", quantity: "50 gousses", price: 9500 },
            { packaging: "Botte sous-vide", quantity: "20 gousses", price: 3800 },
            { packaging: "Botte sous-vide", quantity: "10 gousses", price: 1900 }
        ],
        bullets: ["Longueur premium (présentation & intensité)", "Vente en tube ou par bottes (sous-vide)", "Parfait pour entremets, crèmes, glaces"],
        images: ["/photos-produit-vanille/photos-vanille-16-cm/img_8401.jpg", "/photos-produit-vanille/photos-vanille-16-cm/img_8442.jpg"]
    },
    {
        id: "tk-noir-17-18",
        title: "Vanille TK (Noir) — 17–18 cm",
        subtitle: "Format premium (pro & passionnés)",
        price_label: "5€",
        size: "17–18 cm",
        grade: "TK (Noir)",
        packaging: ["Tube"],
        variants: [
            { packaging: "Tube", quantity: "2 gousses", price: 500 }
        ],
        bullets: ["Longue gousse, expérience haut de gamme", "Vente uniquement en tube (pas de sous-vide)", "Pour pâtissiers, chefs, cadeaux"],
        images: ["/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8403.jpg", "/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8427.jpg", "/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8435.jpg"]
    },
    {
        id: "pack-decouverte",
        title: "Pack Découverte — tailles assorties",
        subtitle: "Tester plusieurs longueurs (mix)",
        price_label: "29€",
        size: "Assorti",
        grade: "Assorti",
        packaging: ["Sous-vide"],
        variants: [
            { packaging: "Sous-vide", quantity: "Assortiment", price: 2900 }
        ],
        bullets: ["Assortiment de gousses (tailles variées)", "Pour trouver votre profil aromatique", "Conditionnement sous‑vide (conservation)"],
        images: ["/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg"]
    },
    {
        id: "pack-pro",
        title: "Pack Pro — volume",
        subtitle: "Pour restauration & pâtisserie",
        price_label: "Devis",
        size: "Volume",
        grade: "TK (Noir) / Assorti",
        packaging: ["Sous-vide"],
        bullets: ["Volumes adaptés aux pros", "Demande de devis rapide (B2B)", "Conditionnement sous‑vide"],
        images: ["/photos-produit-vanille/galerie-photos-qui-sommes-nous/triage-et-calibrage.jpg"]
    },
    {
        id: "poivre-sauvage",
        title: "Poivre Sauvage de Madagascar",
        subtitle: "Récolte sauvage, arôme boisé & frais",
        price_label: "Sur Devis",
        size: "En gros",
        grade: "Premium",
        packaging: ["Sac pro"],
        bullets: ["Poivre rare récolté en forêt", "Disponible uniquement en gros pour le moment", "Bientôt disponible au détail"],
        images: ["/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg"]
    }
];

export function findProduct(id: string) {
    return CATALOG.find(p => p.id === id) || null;
}
