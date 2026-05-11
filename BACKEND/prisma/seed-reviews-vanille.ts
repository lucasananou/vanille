import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Données clients fictives ────────────────────────────────────────────────

const CUSTOMERS = [
  { firstName: 'Marie', lastName: 'D.' },
  { firstName: 'Sophie', lastName: 'L.' },
  { firstName: 'Camille', lastName: 'B.' },
  { firstName: 'Aurélie', lastName: 'M.' },
  { firstName: 'Laure', lastName: 'V.' },
  { firstName: 'Nathalie', lastName: 'R.' },
  { firstName: 'Isabelle', lastName: 'C.' },
  { firstName: 'Julie', lastName: 'F.' },
  { firstName: 'Céline', lastName: 'P.' },
  { firstName: 'Émilie', lastName: 'T.' },
  { firstName: 'Anne', lastName: 'G.' },
  { firstName: 'Claire', lastName: 'H.' },
  { firstName: 'Florence', lastName: 'S.' },
  { firstName: 'Sandrine', lastName: 'K.' },
  { firstName: 'Virginie', lastName: 'N.' },
  { firstName: 'Thomas', lastName: 'A.' },
  { firstName: 'Pierre', lastName: 'J.' },
  { firstName: 'Nicolas', lastName: 'W.' },
  { firstName: 'François', lastName: 'E.' },
  { firstName: 'Marc', lastName: 'O.' },
  { firstName: 'Stéphane', lastName: 'Q.' },
  { firstName: 'Laurent', lastName: 'U.' },
  { firstName: 'David', lastName: 'Y.' },
  { firstName: 'Éric', lastName: 'Z.' },
  { firstName: 'Sylvie', lastName: 'X.' },
];

// ─── Avis généralistes (tous produits) ──────────────────────────────────────

const REVIEWS_GENERIC: { rating: number; title: string; comment: string }[] = [
  {
    rating: 5,
    title: 'Qualité exceptionnelle',
    comment:
      'Je suis bluffée par la qualité de ces gousses. Elles sont charnues, souples et dégagent un parfum incroyable dès l'ouverture du colis. Je ne rachèterai plus jamais en supermarché.',
  },
  {
    rating: 5,
    title: 'Livraison rapide et colis soigné',
    comment:
      'Commandé un mercredi, reçu le vendredi. L'emballage est soigné, les gousses bien protégées. La qualité est au rendez-vous, je recommande vivement.',
  },
  {
    rating: 5,
    title: 'Parfum envoûtant',
    comment:
      'Dès que j'ai ouvert le tube, toute ma cuisine a embaumé la vanille. Un parfum riche et profond, bien différent des gousses sèches et sans intérêt qu'on trouve ailleurs.',
  },
  {
    rating: 5,
    title: 'Un vrai produit d'artisan',
    comment:
      'On sent immédiatement la différence avec les produits industriels. Les gousses sont belles, brillantes, et très aromatiques. Mon foie gras à la vanille était une réussite.',
  },
  {
    rating: 4,
    title: 'Très bonne qualité',
    comment:
      'Excellente vanille, parfum prononcé et gousses bien souples. Je mets 4 étoiles car la livraison a pris un peu plus de temps que prévu, mais le résultat final est top.',
  },
  {
    rating: 5,
    title: 'Idéal pour la pâtisserie',
    comment:
      'J'utilise ces gousses pour mes crèmes brûlées et mes madeleines. Le résultat est incomparable. La vanille parfume vraiment bien, même une seule gousse suffit pour un grand dessert.',
  },
  {
    rating: 5,
    title: 'Cadeau de Noël parfait',
    comment:
      'Offert à ma belle-mère qui est une grande cuisinière. Elle a été ravie, les gousses sont superbes et le conditionnement fait très cadeau. Je recommande sans hésiter.',
  },
  {
    rating: 5,
    title: 'Je reviens pour en racheter',
    comment:
      'C'est ma troisième commande. La régularité de la qualité est vraiment appréciable. Les gousses sont toujours aussi belles et aromatiques. Un sans-faute.',
  },
  {
    rating: 4,
    title: 'Produit conforme, belle odeur',
    comment:
      'Les gousses sont bien souples et sentent très bon. Légèrement moins grasses que celles de ma commande précédente, mais la qualité reste bien supérieure à ce qu'on trouve en grande surface.',
  },
  {
    rating: 5,
    title: 'Extrait maison réussi',
    comment:
      'J'ai fait mon propre extrait de vanille avec ces gousses et le résultat est bluffant. Après 6 semaines, l'extrait est déjà très parfumé et sombre. Une vraie réussite.',
  },
  {
    rating: 5,
    title: 'Gousses charnues et parfumées',
    comment:
      'La longueur et la charnure des gousses sont impressionnantes. On voit vraiment la qualité du tri. L'odeur est intense, sucrée avec des notes boisées très agréables.',
  },
  {
    rating: 5,
    title: 'Bien supérieur au commerce',
    comment:
      'Premier achat ici et je suis conquise. La différence avec la vanille vendue en supermarché est flagrante. Ces gousses sont vivantes, souples, et très généreuses en grains.',
  },
  {
    rating: 3,
    title: 'Correct, mais j'attendais un peu plus',
    comment:
      'Les gousses sont de bonne qualité, le parfum est présent. Deux d'entre elles étaient un peu plus sèches que je ne l'aurais souhaité. Le service client a été réactif et a proposé un geste commercial.',
  },
  {
    rating: 5,
    title: 'Commande pro très satisfaisante',
    comment:
      'Je gère un restaurant et j'utilise de la vanille régulièrement. La qualité MSV Nosy-Be est constante, le prix est cohérent pour des gousses de cette calibre. Je recommande pour les pros.',
  },
  {
    rating: 5,
    title: 'Conditionnement impeccable',
    comment:
      'Le tube est solide et les gousses arrivent parfaitement protégées. Aucun problème d'humidité ou d'écrasement. Le soin apporté au conditionnement est vraiment appréciable.',
  },
  {
    rating: 5,
    title: 'Acheté plusieurs fois',
    comment:
      'Je suis cliente fidèle depuis plus d'un an. La qualité ne déçoit jamais, la livraison est fiable. J'ai également essayé le poivre sauvage et c'est excellent aussi.',
  },
  {
    rating: 4,
    title: 'Très bonne vanille de Madagascar',
    comment:
      'Gousses bien noires, souples et très parfumées. Le conditionnement sous vide préserve bien la fraîcheur. Je retire une étoile car j'aurais aimé un peu plus de clarté sur la date de récolte.',
  },
  {
    rating: 5,
    title: 'Pour ma crème à la vanille',
    comment:
      'Utilisée pour une crème pâtissière de compétition. Le parfum de la vanille a sublimé toute la préparation. Les grains sont abondants et bien noirs. Exactement ce dont j'avais besoin.',
  },
];

// ─── Avis spécifiques par type de produit ───────────────────────────────────

const REVIEWS_BY_KEYWORD: Record<string, { rating: number; title: string; comment: string }[]> = {
  poivre: [
    {
      rating: 5,
      title: 'Poivre sauvage exceptionnel',
      comment:
        'Je n'avais jamais goûté un poivre aussi complexe. Des notes boisées, légèrement fumées, avec une belle chaleur en fin de bouche. Parfait sur un magret ou un carpaccio.',
    },
    {
      rating: 5,
      title: 'Découverte incroyable',
      comment:
        'Ce poivre sauvage de Madagascar est une révélation. Il parfume les plats sans agressivité, avec un équilibre très subtil. Je l'utilise maintenant sur presque tout.',
    },
    {
      rating: 5,
      title: 'Un poivre hors du commun',
      comment:
        'Les arômes sont incomparables avec un poivre classique. Notes fruitées et boisées très prononcées. La mouture est facile, les grains sont bien secs et bien formés.',
    },
    {
      rating: 4,
      title: 'Très aromatique, légèrement moins piquant',
      comment:
        'Ce poivre est plus aromatique que piquant, ce qui peut surprendre si l'on cherche de la force. Moi j'adore, il apporte du caractère sans agresser le palais.',
    },
  ],
  pack: [
    {
      rating: 5,
      title: 'Pack découverte parfait pour commencer',
      comment:
        'Le pack permet de tester différentes longueurs avant d'investir dans une sélection précise. Toutes les gousses sont de qualité et le rapport qualité-prix est excellent.',
    },
    {
      rating: 5,
      title: 'Excellent rapport qualité-prix',
      comment:
        'Pour le prix, on reçoit une qualité que l'on ne trouve pas facilement. Le format pack est idéal pour les gros consommateurs de vanille comme moi.',
    },
    {
      rating: 5,
      title: 'Cadeau gourmand réussi',
      comment:
        'Offert à une amie passionnée de cuisine. Elle a été très touchée par la qualité et la présentation. Le pack fait vraiment un joli cadeau.',
    },
  ],
  '18': [
    {
      rating: 5,
      title: 'Les plus belles gousses que j'ai vues',
      comment:
        'Ces grandes gousses de 18 cm sont impressionnantes. Elles sont charnues, très souples et dégagent un parfum intense. Parfaites pour une belle crème brûlée de restaurant.',
    },
    {
      rating: 5,
      title: 'Format idéal pour la pâtisserie professionnelle',
      comment:
        'Je travaille en pâtisserie et ces gousses de grande taille sont exactement ce dont j'ai besoin. La qualité est constante et le parfum très prononcé. Je commande régulièrement.',
    },
  ],
  '16': [
    {
      rating: 5,
      title: 'Le bon équilibre',
      comment:
        'Ce format 16 cm est parfait : assez grand pour être très parfumé, assez pratique à utiliser. La qualité des gousses est remarquable, très souples et brillantes.',
    },
    {
      rating: 4,
      title: 'Très bonne sélection',
      comment:
        'Des gousses bien calibrées et très aromatiques. Le rapport taille/prix est très intéressant. Je reviendrai sur ce format pour ma prochaine commande.',
    },
  ],
  '14': [
    {
      rating: 5,
      title: 'Format pratique et très parfumé',
      comment:
        'Ces gousses de 14-15 cm sont très pratiques à utiliser en cuisine. Bien souples, très odorantes. Une seule gousse suffit pour parfumer un litre de crème.',
    },
    {
      rating: 5,
      title: 'Idéal au quotidien',
      comment:
        'Format parfait pour une utilisation régulière à la maison. La qualité est là, les gousses sont fraîches et généreuses. Je recommande pour une utilisation au quotidien.',
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

function getReviewPool(product: { title: string; slug: string }) {
  const key = Object.keys(REVIEWS_BY_KEYWORD).find((k) =>
    product.title.toLowerCase().includes(k) || product.slug.toLowerCase().includes(k)
  );
  const specific = key ? REVIEWS_BY_KEYWORD[key] : [];
  return [...REVIEWS_GENERIC, ...specific];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌿 Seed avis vanille — démarrage...\n');

  const products = await prisma.product.findMany({
    select: { id: true, title: true, slug: true },
  });

  if (products.length === 0) {
    console.log('❌ Aucun produit trouvé en base. Vérifiez que le catalogue est importé.');
    return;
  }

  console.log(`📦 ${products.length} produit(s) trouvé(s).`);

  // Suppression des anciens avis
  const deleted = await prisma.review.deleteMany({});
  console.log(`🗑  ${deleted.count} ancien(s) avis supprimé(s).\n`);

  let total = 0;

  for (const product of products) {
    const pool = getReviewPool(product);
    // Entre 6 et 14 avis par produit
    const count = 6 + Math.floor(Math.random() * 9);
    const used = new Set<string>();

    console.log(`📝 ${product.title} → ${count} avis`);

    for (let i = 0; i < count; i++) {
      const customer = pick(CUSTOMERS);
      let review = pick(pool);

      // Éviter les doublons exact de titre sur le même produit
      let attempts = 0;
      while (used.has(review.title) && attempts < 10) {
        review = pick(pool);
        attempts++;
      }
      used.add(review.title);

      await prisma.review.create({
        data: {
          productId: product.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          status: ReviewStatus.APPROVED,
          verifiedPurchase: Math.random() > 0.25,
          helpfulCount: Math.floor(Math.random() * 12),
          // Répartis sur les 90 derniers jours
          createdAt: randomDate(90),
          // Pas de customerId — avis "invité"
        },
      });

      total++;
    }
  }

  console.log(`\n✅ ${total} avis créés et approuvés avec succès.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
