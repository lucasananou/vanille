import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

const FIRST_NAMES = [
    'Marie', 'Sophie', 'Julie', 'Léa', 'Camille', 'Sarah', 'Emma', 'Chloé', 'Laura', 'Audrey',
    'Lisa', 'Manon', 'Céline', 'Alice', 'Elodie', 'Noémie', 'Mathilde', 'Charlotte', 'Anaïs', 'Aurélie',
    'Rachel', 'Rivka', 'Hannah', 'Déborah', 'Esther', 'Myriam', 'Judith', 'Rebecca', 'Tzipora', 'Yael',
    'Deborah', 'Leah', 'Chana', 'Tamar', 'Ariane', 'Élise', 'Clara'
];

const LAST_NAMES = [
    'Cohen', 'Levy', 'Bembaron', 'Saada', 'Benhamou', 'Assouline', 'Fitoussi', 'Sultan', 'Abecassis', 'Guez',
    'Azoulay', 'Benizri', 'Benaim', 'Bensoussan', 'Dahan', 'Elbaz', 'Haddad', 'Kalfon', 'Lasry', 'Marciano',
    'Mimoun', 'Nakache', 'Ohana', 'Partouche', 'Sebbag', 'Serfaty', 'Temam', 'Touati', 'Zrihen', 'Amsellem',
    'B.', 'L.', 'A.', 'M.', 'S.', 'P.', 'V.', 'K.', 'G.', 'H.', 'D.', 'T.', 'R.', 'F.', 'J.', 'W.', 'N.'
];

const GENERAL_COMMENTS = [
    { title: "Magnifique !", text: "Très satisfaite de cet achat. La qualité est au rendez-vous." },
    { title: "Conforme", text: "L'article correspond parfaitement aux photos. Je recommande." },
    { title: "Rapidité", text: "Livraison très rapide et colis soigné. Merci !" },
    { title: "Parfait", text: "Rien à dire, c'est exactement ce que je cherchais." },
    { title: "Élégant", text: "Très beau produit, rendu très chic." },
    { title: "Superbe qualité", text: "Le tissu est de très bonne facture, agréable à porter." },
    { title: "Ravie", text: "Je suis ravie de mon achat, je recommanderai sur ce site." },
    { title: "Coup de coeur", text: "Cette pièce est devenue ma préférée en quelques jours !" }
];

const CATEGORY_SPECIFIC: Record<string, { title: string, text: string }[]> = {
    'robe-tsniout': [
        { title: "Longueur parfaite", text: "Enfin une robe qui respecte vraiment la tsniout sans retouches. Tissu très agréable." },
        { title: "Coupe fluide", text: "La coupe est magnifique, elle tombe très bien. Je l'ai prise en M." },
        { title: "Pas transparente", text: "Tissu bien opaque, c'est rassurant. Très bel article." },
        { title: "Idéale pour les fêtes", text: "Achetée pour une occasion, j'ai eu beaucoup de compliments." },
        { title: "Sublime", text: "Les détails sont fins et la robe est très confortable." }
    ],
    'jupe-longue-tsniout': [
        { title: "Très belle jupe", text: "La longueur est idéale et le tissu ne se froisse pas trop." },
        { title: "Indispensable", text: "Une basique à avoir dans sa garde-robe. Très élégante." },
        { title: "Superbe tombé", text: "Le plissé est magnifique. Très contente." },
        { title: "Taille bien", text: "J'avais peur pour la taille mais le guide est correct. Pris en S." }
    ],
    'collier': [
        { title: "Très fin", text: "Un bijou délicat qui finit bien une tenue. Très bel éclat." },
        { title: "Cadeau parfait", text: "Offert à ma soeur, elle a adoré. Très soigné." },
        { title: "Magnifique", text: "Encore plus beau en vrai qu'en photo." }
    ],
    'veste-tsniout': [
        { title: "Chic et sobre", text: "La veste finit parfaitement une tenue habillée. Belle coupe." },
        { title: "Qualité supérieure", text: "On sent que les finitions sont travaillées. Très satisfaite." }
    ],
    'chemisier': [
        { title: "Blouse élégante", text: "Tissu très doux et pas du tout transparent. Parfait pour le bureau." },
        { title: "Détails soignés", text: "Les poignets sont très beaux. Très contente de mon achat." }
    ]
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log("Starting review seeding (v2 - Refresh)...");

    const products = await prisma.product.findMany({
        include: { collection: true }
    });

    console.log(`Found ${products.length} products. Clearing existing reviews...`);

    // Deleting all existing reviews
    const deleted = await prisma.review.deleteMany({});
    console.log(`Deleted ${deleted.count} old reviews.`);

    for (const product of products) {
        // Generate between 8 and 12 reviews
        const reviewCount = 8 + Math.floor(Math.random() * 5);
        console.log(`Generating ${reviewCount} reviews for: ${product.title}`);

        const specificComments = product.collection?.slug ? (CATEGORY_SPECIFIC[product.collection.slug] || []) : [];
        const pool = [...GENERAL_COMMENTS, ...specificComments];

        for (let i = 0; i < reviewCount; i++) {
            const firstName = getRandomItem(FIRST_NAMES);
            const lastName = getRandomItem(LAST_NAMES);
            const fullName = `${firstName} ${lastName}`;

            const commentTemplate = getRandomItem(pool);

            // Randomize rating (80% 5 stars, 15% 4 stars, 5% 3 stars)
            const rand = Math.random();
            const rating = rand > 0.2 ? 5 : (rand > 0.05 ? 4 : 3);

            await prisma.review.create({
                data: {
                    productId: product.id,
                    rating: rating,
                    title: commentTemplate.title,
                    comment: commentTemplate.text,
                    status: ReviewStatus.APPROVED,
                    verifiedPurchase: Math.random() > 0.2,
                    helpfulCount: Math.floor(Math.random() * 10),
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 60)) // Within last 60 days
                }
            });
        }
    }

    console.log("Successfully seeded ~10 reviews per product!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
