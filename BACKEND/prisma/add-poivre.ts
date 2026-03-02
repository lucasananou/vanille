import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Adding Poivre Sauvage de Madagascar...');

    // 1. Get or Create Collection (e.g., 'Vanille de Madagascar' or create a 'Poivres' one?)
    // Based on the user's vanille site, let's see current collections.
    const collections = await prisma.collection.findMany();
    console.log('Current collections:', collections.map(c => c.name));

    // Let's create a 'Poivres de Madagascar' collection or just add to existing if appropriate.
    // The user said "rajouter aussi cet article", it might be a new category.
    const collection = await prisma.collection.upsert({
        where: { slug: 'poivres-de-madagascar' },
        update: {},
        create: {
            name: 'Poivres de Madagascar',
            slug: 'poivres-de-madagascar',
            description: 'Les meilleurs poivres de l\'île rouge.',
            published: true,
        },
    });

    const description = `Poivre Sauvage de Madagascar

Poivre Sauvage d’Exception
L’Expression Pure du Terroir Malgache

Issu des terres préservées de Madagascar, notre poivre sauvage de Madagascar est récolté à la main selon un savoir-faire traditionnel transmis de génération en génération. Véritable trésor naturel, il offre des arômes puissants, raffinés et profondément authentiques.

Madagascar, île d’exception reconnue pour sa biodiversité unique au monde, abrite une flore d’une richesse remarquable. C’est au cœur de cet environnement encore sauvage et préservé que notre poivre puise son caractère incomparable. Cette diversité naturelle exceptionnelle confère aux grains une intensité aromatique rare, reflet fidèle de son terroir d’origine.

Chaque grain révèle ainsi la richesse du terroir malgache : des notes boisées intenses, une chaleur subtilement épicée et une longueur en bouche remarquable. Produit rare et recherché, il séduit les passionnés de gastronomie ainsi que les chefs en quête d’excellence et d’authenticité.

Récolte artisanale
Origine : Madagascar
Quantités limitées

Un nouvel arrivage sera disponible très prochainement. En raison de son caractère exclusif, les stocks resteront volontairement limités afin de garantir une qualité et une fraîcheur optimales.

Expédition soignée
Précommandes recommandées

Offrez à votre table la noblesse d’un poivre sauvage de Madagascar, authentique, rare et naturellement exceptionnel.`;

    const product = await prisma.product.create({
        data: {
            title: 'Poivre Sauvage de Madagascar',
            slug: 'poivre-sauvage-madagascar',
            sku: 'POIVRE-SAUVAGE',
            description: description,
            price: 1000, // Default price 10€ for 100g (in cents)
            stock: 50,
            images: ['/photos-produit-vanille/poivre-sauvage-madagascar.jpg'],
            tags: ['poivre', 'sauvage', 'madagascar', 'epice'],
            published: true,
            collectionId: collection.id,
            options: {
                create: [
                    {
                        name: 'Poids',
                        values: ['100g', '1kg'],
                        position: 0
                    }
                ]
            },
            variants: {
                create: [
                    {
                        sku: 'POIVRE-SAUVAGE-100G',
                        title: '100g',
                        price: 1000,
                        stock: 50,
                        options: { Poids: '100g' }
                    },
                    {
                        sku: 'POIVRE-SAUVAGE-1KG',
                        title: '1kg',
                        price: 10000,
                        stock: 10,
                        options: { Poids: '1kg' }
                    }
                ]
            }
        }
    });

    console.log(`✅ Product created: ${product.title} with ID: ${product.id}`);
}

main()
    .catch((e) => {
        console.error('❌ Error adding product:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
