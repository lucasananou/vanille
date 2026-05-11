
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const FIRST_NAMES = [
    'Marie', 'Sophie', 'Julie', 'Léa', 'Camille', 'Sarah', 'Emma', 'Chloé', 'Laura', 'Audrey',
    'Lisa', 'Manon', 'Céline', 'Alice', 'Elodie', 'Noémie', 'Mathilde', 'Charlotte', 'Anaïs', 'Aurélie',
    'Rachel', 'Rivka', 'Hannah', 'Déborah', 'Esther', 'Myriam', 'Judith', 'Rebecca', 'Tzipora', 'Yael'
];

const LAST_NAMES = [
    'Cohen', 'Levy', 'Bembaron', 'Saada', 'Benhamou', 'Assouline', 'Fitoussi', 'Sultan', 'Abecassis', 'Guez',
    'Azoulay', 'Benizri', 'Benaim', 'Bensoussan', 'Dahan', 'Elbaz', 'Haddad', 'Kalfon', 'Lasry', 'Marciano',
    'Mimoun', 'Nakache', 'Ohana', 'Partouche', 'Sebbag', 'Serfaty', 'Temam', 'Touati', 'Zrihen', 'Amsellem'
];

const POSITIVE_TITLES = [
    "Magnifique !", "Très satisfaite", "Superbe qualité", "Je recommande", "Parfait",
    "Très beau produit", "Exactement ce que je cherchais", "Ravie de mon achat",
    "Qualité incroyable", "Très élégant", "Coup de cœur", "Excellent", "J'adore"
];

const POSITIVE_COMMENTS = [
    "La qualité du tissu est vraiment au rendez-vous. La coupe est parfaite et respecte bien les règles de Tsniout tout en restant moderne.",
    "Envoi très rapide et soigné. Le vêtement est encore plus beau en vrai que sur les photos !",
    "Je suis ravie de mon achat. La taille correspond parfaitement et le tissu est très agréable à porter.",
    "Enfin une marque qui propose des vêtements élégants et pudiques. Je commanderai à nouveau sans hésiter.",
    "Le tombé est impeccable. Je l'ai portée pour une Bar Mitzvah et je n'ai eu que des compliments.",
    "Très belle pièce, finitions parfaites. Le rapport qualité-prix est excellent.",
    "J'avais peur pour la taille mais le guide est très précis. Elle me va comme un gant !",
    "Un vrai coup de cœur pour cette pièce. Elle est facile à assortir et très confortable.",
    "Livraison rapide, emballage soigné. Produit conforme à la description.",
    "Je cherchais une tenue habillée mais sobre, c'est exactement ce qu'il me fallait."
];

const NEUTRAL_TITLES = [
    "Bon produit", "Bien mais...", "Correct", "Pas mal", "Conforme"
];

const NEUTRAL_COMMENTS = [
    "Joli modèle mais la couleur est légèrement différente de la photo.",
    "Belles finitions mais taille un peu petit au niveau de la taille.",
    "La qualité est là, mais je m'attendais à un tissu un peu plus épais.",
    "Bon produit dans l'ensemble, livraison un peu longue.",
    "Correct pour le prix, mais sans plus."
];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log('🌱 Extension des avis produits en cours (JS Mode)...');

    // 1. Get all products
    const products = await prisma.product.findMany();
    if (products.length === 0) {
        console.log('❌ Aucun produit trouvé. Veuillez d\'abord lancer le seed principal.');
        return;
    }

    // 2. Create a pool of fake customers if needed
    console.log('👤 Vérification des clients...');
    let customers = await prisma.customer.findMany();

    if (customers.length < 10) {
        console.log('Creating more customers for reviews...');
        const newCustomers = [];
        for (let i = 0; i < 20; i++) {
            const firstName = getRandomItem(FIRST_NAMES);
            const lastName = getRandomItem(LAST_NAMES);
            newCustomers.push({
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 9999)}@example.com`,
                password: 'password123',
                firstName,
                lastName,
                emailVerified: true
            });
        }

        await prisma.customer.createMany({
            data: newCustomers,
            skipDuplicates: true,
        });
        customers = await prisma.customer.findMany();
    }

    // 3. Generate reviews for each product
    for (const product of products) {
        const reviewCount = getRandomInt(15, 25);
        console.log(`📝 Génération de ${reviewCount} avis pour : ${product.title}`);

        // Clear existing reviews
        await prisma.review.deleteMany({
            where: { productId: product.id }
        });

        const reviewsData = [];

        for (let i = 0; i < reviewCount; i++) {
            const customer = getRandomItem(customers);

            // Weight towards positive reviews (4-5 stars)
            // 70% 5 stars, 20% 4 stars, 10% 3 stars
            const rand = Math.random();
            let rating = 5;
            let title = "";
            let comment = "";

            if (rand < 0.7) {
                rating = 5;
                title = getRandomItem(POSITIVE_TITLES);
                comment = getRandomItem(POSITIVE_COMMENTS);
            } else if (rand < 0.9) {
                rating = 4;
                title = getRandomItem(POSITIVE_TITLES);
                comment = getRandomItem(POSITIVE_COMMENTS) + " " + getRandomItem(NEUTRAL_COMMENTS);
            } else {
                rating = 3;
                title = getRandomItem(NEUTRAL_TITLES);
                comment = getRandomItem(NEUTRAL_COMMENTS);
            }

            // Randomize date within last 6 months
            const date = new Date();
            date.setDate(date.getDate() - getRandomInt(1, 180));

            reviewsData.push({
                productId: product.id,
                customerId: customer.id,
                rating,
                title,
                comment,
                status: 'APPROVED',
                verifiedPurchase: Math.random() > 0.3,
                createdAt: date,
                updatedAt: date
            });
        }

        // Insert reviews
        for (const data of reviewsData) {
            await prisma.review.create({
                data: data
            });
        }
    }

    console.log('✅ Avis générés avec succès !');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
