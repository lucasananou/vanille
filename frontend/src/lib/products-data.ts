export interface ProductData {
    id: string;
    title: string;
    subtitle: string;
    price_label: string;
    size: string;
    grade: string;
    packaging: string[];
    bullets: string[];
}

export const CATALOG: ProductData[] = [
    {
        id: "tk-noir-10-13",
        title: "Vanille TK (Noir) — 10–13 cm",
        subtitle: "Arôme intense, usage quotidien",
        price_label: "—",
        size: "10–13 cm",
        grade: "TK (Noir)",
        packaging: ["Sous-vide", "Tube"],
        bullets: ["Sélection TK (Noir) / Gourmet (selon lot)", "Idéal pour desserts, infusion, cuisine", "Conditionnement au choix : Sous‑vide ou Tube"]
    },
    {
        id: "tk-noir-14-15",
        title: "Vanille TK (Noir) — 14–15 cm",
        subtitle: "Équilibre longueur / puissance aromatique",
        price_label: "—",
        size: "14–15 cm",
        grade: "TK (Noir)",
        packaging: ["Sous-vide", "Tube"],
        bullets: ["Longueur polyvalente (pâtisserie, extrait maison)", "Gousses souples, parfum gourmand", "Conditionnement au choix : Sous‑vide ou Tube"]
    },
    {
        id: "tk-noir-16",
        title: "Vanille TK (Noir) — 16 cm",
        subtitle: "Pour pâtisserie fine & cadeaux gourmands",
        price_label: "—",
        size: "16 cm",
        grade: "TK (Noir)",
        packaging: ["Sous-vide", "Tube"],
        bullets: ["Longueur premium (présentation & intensité)", "Parfait pour entremets, crèmes, glaces", "Conditionnement au choix : Sous‑vide ou Tube"]
    },
    {
        id: "tk-noir-17-18",
        title: "Vanille TK (Noir) — 17–18 cm",
        subtitle: "Format premium (pro & passionnés)",
        price_label: "—",
        size: "17–18 cm",
        grade: "TK (Noir)",
        packaging: ["Sous-vide", "Tube"],
        bullets: ["Longue gousse, expérience haut de gamme", "Pour pâtissiers, chefs, cadeaux", "Conditionnement au choix : Sous‑vide ou Tube"]
    },
    {
        id: "pack-decouverte",
        title: "Pack Découverte — tailles assorties",
        subtitle: "Tester plusieurs longueurs (mix)",
        price_label: "—",
        size: "Assorti",
        grade: "Assorti",
        packaging: ["Sous-vide"],
        bullets: ["Assortiment de gousses (tailles variées)", "Pour trouver votre profil aromatique", "Conditionnement sous‑vide (conservation)"]
    },
    {
        id: "pack-pro",
        title: "Pack Pro — volume",
        subtitle: "Pour restauration & pâtisserie",
        price_label: "Devis",
        size: "Volume",
        grade: "TK (Noir) / Assorti",
        packaging: ["Sous-vide"],
        bullets: ["Volumes adaptés aux pros", "Demande de devis rapide (B2B)", "Conditionnement sous‑vide"]
    }
];

export function findProduct(id: string) {
    return CATALOG.find(p => p.id === id) || null;
}
