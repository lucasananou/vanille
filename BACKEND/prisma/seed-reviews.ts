import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

const NAMES = [
    "Sarah C.", "Myriam B.", "Deborah L.", "Rachel A.", "Rivka M.",
    "Leah S.", "Chana P.", "Esther V.", "Noémie K.", "Yaël G.",
    "Judith H.", "Sharon D.", "Abigail T.", "Hanna R.", "Tamar F.",
    "Édith J.", "Ariane W.", "Élise N.", "Clara B.", "Sophie M."
];

const GENERAL_COMMENTS = [
    { title: "Magnifique !", text: "Très satisfaite de cet achat. La qualité est au rendez-vous." },
    { title: "Conforme", text: "L'article correspond parfaitement aux photos. Je recommande." },
    { title: "Rapidité", text: "Livraison très rapide et colis soigné. Merci !" },
    { title: "Parfait", text: "Rien à dire, c'est exactement ce que je cherchais." },
    { title: "Élégant", text: "Trés beau produit, rendu très chic." }
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

async function main() {
    console.log("Starting review seeding...");

    const products = await prisma.product.findMany({
        include: { collection: true }
    });

    console.log(`Found ${products.length} products.`);

    for (const product of products) {
        const reviewCount = 8 + Math.floor(Math.random() * 5); // 8 to 12 reviews
        console.log(`Generating ${reviewCount} reviews for: ${product.title}`);

        // Get specific comments if available, otherwise general
        const specificComments = product.collection?.slug ? (CATEGORY_SPECIFIC[product.collection.slug] || []) : [];
        const pool = [...GENERAL_COMMENTS, ...specificComments];

        for (let i = 0; i < reviewCount; i++) {
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const commentTemplate = pool[Math.floor(Math.random() * pool.length)];

            // Randomize rating slightly (mostly 4 and 5)
            const rating = Math.random() > 0.3 ? 5 : (Math.random() > 0.5 ? 4 : 3);

            await prisma.review.create({
                data: {
                    productId: product.id,
                    rating: rating,
                    title: commentTemplate.title,
                    comment: commentTemplate.text,
                    status: ReviewStatus.APPROVED,
                    verifiedPurchase: Math.random() > 0.2, // 80% verified
                    helpfulCount: Math.floor(Math.random() * 10),
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)) // Within last 30 days
                }
            });
        }
    }

    console.log("Successfully seeded reviews!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
