export type VanilleVariantSeed = {
  sku: string;
  title: string;
  price: number;
  stock: number;
  options: Record<string, string>;
  image?: string;
};

export type VanilleProductSeed = {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  collectionSlug: string;
  collectionName: string;
  collectionDescription: string;
  options?: Array<{
    name: string;
    values: string[];
    position: number;
  }>;
  variants?: VanilleVariantSeed[];
};

export const VANILLE_PRODUCTS: VanilleProductSeed[] = [
  {
    title: 'Vanille TK (Noir) — 10–13 cm',
    slug: 'vanille-tk-noir-10-13cm',
    subtitle: 'Arôme intense, usage quotidien',
    description:
      'Sélection TK (Noir) / Gourmet (selon lot). Vente uniquement par bottes (sous-vide). Idéal pour desserts, infusion, cuisine.',
    sku: 'VAN-TK-1013',
    price: 4500,
    stock: 120,
    images: [
      '/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8423.jpg',
      '/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8450.jpg',
      '/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8456.jpg',
    ],
    tags: ['vanille', 'madagascar', 'nosy-be'],
    collectionSlug: 'vanille-de-madagascar',
    collectionName: 'Vanille de Madagascar',
    collectionDescription: "L'excellence de Nosy-Be directement chez vous.",
    options: [
      { name: 'Conditionnement', values: ['Botte sous-vide'], position: 0 },
      { name: 'Quantité', values: ['50 gousses', '25 gousses'], position: 1 },
    ],
    variants: [
      {
        sku: 'VAN-TK-1013-SV-50',
        title: 'Botte sous-vide / 50 gousses',
        price: 9000,
        stock: 40,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '50 gousses' },
      },
      {
        sku: 'VAN-TK-1013-SV-25',
        title: 'Botte sous-vide / 25 gousses',
        price: 4500,
        stock: 80,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '25 gousses' },
      },
    ],
  },
  {
    title: 'Vanille TK (Noir) — 14–15 cm',
    slug: 'vanille-tk-noir-14-15cm',
    subtitle: 'Équilibre longueur / puissance aromatique',
    description:
      'Longueur polyvalente (pâtisserie, extrait maison). Vente en tube ou par bottes (sous-vide). Gousses souples, parfum gourmand.',
    sku: 'VAN-TK-1415',
    price: 500,
    stock: 123,
    images: [
      '/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg',
      '/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8394.jpg',
      '/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8415.jpg',
    ],
    tags: ['vanille', 'madagascar', 'premium'],
    collectionSlug: 'vanille-de-madagascar',
    collectionName: 'Vanille de Madagascar',
    collectionDescription: "L'excellence de Nosy-Be directement chez vous.",
    options: [
      { name: 'Conditionnement', values: ['Tube', 'Botte sous-vide'], position: 0 },
      { name: 'Quantité', values: ['3 gousses', '50 gousses', '20 gousses', '10 gousses'], position: 1 },
    ],
    variants: [
      {
        sku: 'VAN-TK-1415-TUBE-3',
        title: 'Tube / 3 gousses',
        price: 500,
        stock: 30,
        options: { Conditionnement: 'Tube', Quantité: '3 gousses' },
      },
      {
        sku: 'VAN-TK-1415-SV-50',
        title: 'Botte sous-vide / 50 gousses',
        price: 9000,
        stock: 18,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '50 gousses' },
      },
      {
        sku: 'VAN-TK-1415-SV-20',
        title: 'Botte sous-vide / 20 gousses',
        price: 3600,
        stock: 30,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '20 gousses' },
      },
      {
        sku: 'VAN-TK-1415-SV-10',
        title: 'Botte sous-vide / 10 gousses',
        price: 1800,
        stock: 45,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '10 gousses' },
      },
    ],
  },
  {
    title: 'Vanille TK (Noir) — 16 cm',
    slug: 'vanille-tk-noir-16cm',
    subtitle: 'Pour pâtisserie fine & cadeaux gourmands',
    description:
      'Longueur premium (présentation & intensité). Vente en tube ou par bottes (sous-vide). Parfait pour entremets, crèmes, glaces.',
    sku: 'VAN-TK-16',
    price: 500,
    stock: 118,
    images: [
      '/photos-produit-vanille/photos-vanille-16-cm/img_8401.jpg',
      '/photos-produit-vanille/photos-vanille-16-cm/img_8442.jpg',
    ],
    tags: ['vanille', 'chef', 'premium'],
    collectionSlug: 'vanille-de-madagascar',
    collectionName: 'Vanille de Madagascar',
    collectionDescription: "L'excellence de Nosy-Be directement chez vous.",
    options: [
      { name: 'Conditionnement', values: ['Tube', 'Botte sous-vide'], position: 0 },
      { name: 'Quantité', values: ['2 gousses', '50 gousses', '20 gousses', '10 gousses'], position: 1 },
    ],
    variants: [
      {
        sku: 'VAN-TK-16-TUBE-2',
        title: 'Tube / 2 gousses',
        price: 500,
        stock: 28,
        options: { Conditionnement: 'Tube', Quantité: '2 gousses' },
      },
      {
        sku: 'VAN-TK-16-SV-50',
        title: 'Botte sous-vide / 50 gousses',
        price: 9500,
        stock: 15,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '50 gousses' },
      },
      {
        sku: 'VAN-TK-16-SV-20',
        title: 'Botte sous-vide / 20 gousses',
        price: 3800,
        stock: 30,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '20 gousses' },
      },
      {
        sku: 'VAN-TK-16-SV-10',
        title: 'Botte sous-vide / 10 gousses',
        price: 1900,
        stock: 45,
        options: { Conditionnement: 'Botte sous-vide', Quantité: '10 gousses' },
      },
    ],
  },
  {
    title: 'Vanille TK (Noir) — 17–18 cm',
    slug: 'vanille-tk-noir-17-18cm',
    subtitle: 'Format premium (pro & passionnés)',
    description:
      'Longue gousse, expérience haut de gamme. Vente uniquement en tube (pas de sous-vide). Pour pâtissiers, chefs, cadeaux.',
    sku: 'VAN-TK-1718',
    price: 500,
    stock: 30,
    images: [
      '/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8403.jpg',
      '/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8427.jpg',
      '/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8435.jpg',
    ],
    tags: ['vanille', 'madagascar', 'exclusive'],
    collectionSlug: 'vanille-de-madagascar',
    collectionName: 'Vanille de Madagascar',
    collectionDescription: "L'excellence de Nosy-Be directement chez vous.",
    options: [
      { name: 'Conditionnement', values: ['Tube'], position: 0 },
      { name: 'Quantité', values: ['2 gousses'], position: 1 },
    ],
    variants: [
      {
        sku: 'VAN-TK-1718-TUBE-2',
        title: 'Tube / 2 gousses',
        price: 500,
        stock: 30,
        options: { Conditionnement: 'Tube', Quantité: '2 gousses' },
      },
    ],
  },
  {
    title: 'Pack Découverte',
    slug: 'pack-decouverte',
    subtitle: 'Tester plusieurs longueurs (mix)',
    description:
      "Assortiment de gousses (tailles variées). 17–18 cm : 2 gousses, 16 cm : 2 gousses, 14–15 cm : 10 gousses, 10–13 cm : 10 gousses, plus une surprise incluse.",
    sku: 'VAN-PACK-DEC',
    price: 2900,
    stock: 40,
    images: ['/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg'],
    tags: ['pack', 'decouverte', 'vanille'],
    collectionSlug: 'vanille-de-madagascar',
    collectionName: 'Vanille de Madagascar',
    collectionDescription: "L'excellence de Nosy-Be directement chez vous.",
    options: [{ name: 'Conditionnement', values: ['Sous-vide'], position: 0 }],
    variants: [
      {
        sku: 'VAN-PACK-DEC-SV',
        title: 'Sous-vide / Assortiment',
        price: 2900,
        stock: 40,
        options: { Conditionnement: 'Sous-vide' },
      },
    ],
  },
  {
    title: 'Poivre Sauvage de Madagascar',
    slug: 'poivre-sauvage-madagascar',
    subtitle: "L'Expression Pure du Terroir Malgache",
    description:
      "Issu des terres préservées de Madagascar, notre poivre sauvage est récolté à la main selon un savoir-faire traditionnel. Notes boisées intenses, chaleur subtilement épicée et longueur en bouche remarquable.",
    sku: 'POIVRE-SAUVAGE',
    price: 1000,
    stock: 60,
    images: ['/photos-produit-vanille/poivre-sauvage-madagascar.jpg'],
    tags: ['poivre', 'sauvage', 'madagascar'],
    collectionSlug: 'poivres-de-madagascar',
    collectionName: 'Poivres de Madagascar',
    collectionDescription: "Les meilleurs poivres de l'île rouge.",
    options: [{ name: 'Poids', values: ['100g', '1kg'], position: 0 }],
    variants: [
      {
        sku: 'POIVRE-SAUVAGE-100G',
        title: '100g',
        price: 1000,
        stock: 50,
        options: { Poids: '100g' },
      },
      {
        sku: 'POIVRE-SAUVAGE-1KG',
        title: '1kg',
        price: 10000,
        stock: 10,
        options: { Poids: '1kg' },
      },
    ],
  },
];
