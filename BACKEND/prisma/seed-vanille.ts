
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Vanille seed...');

    // 1. Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.review.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productOption.deleteMany();
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();

    // 2. Create Vanille collection
    const collection = await prisma.collection.upsert({
        where: { slug: 'vanille-de-madagascar' },
        update: {},
        create: {
            name: 'Vanille de Madagascar',
            slug: 'vanille-de-madagascar',
            description: 'L\'excellence de Nosy-Be directement chez vous.',
            published: true,
        },
    });
    console.log('✅ Created Vanille collection');

    // 3. Define products (matching frontend CATALOG and correct files)
    const vanillaProducts = [
        {
            id: "tk-noir-10-13",
            title: "Vanille TK (Noir) — 10–13 cm",
            slug: "vanille-tk-noir-10-13cm",
            subtitle: "Arôme intense, usage quotidien",
            price: 4500, // 45.00€
            sku: "VAN-TK-1013",
            stock: 100,
            images: ["/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8423.jpg", "/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8450.jpg", "/photos-produit-vanille/photos-vanille-10-a-13-cm/img_8456.jpg"],
            description: "Sélection TK (Noir) / Gourmet (selon lot). Vente uniquement par bottes (sous-vide). Idéal pour desserts, infusion, cuisine.",
            tags: ["vanille", "madagascar", "nosy-be"],
        },
        {
            id: "tk-noir-14-15",
            title: "Vanille TK (Noir) — 14–15 cm",
            slug: "vanille-tk-noir-14-15cm",
            subtitle: "Équilibre longueur / puissance aromatique",
            price: 500, // 5.00€ (le tube)
            sku: "VAN-TK-1415",
            stock: 80,
            images: ["/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8387.jpg", "/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8394.jpg", "/photos-produit-vanille/photos-vanille-de-14-a-15-cm/img_8415.jpg"],
            description: "Longueur polyvalente (pâtisserie, extrait maison). Gousses souples, parfum gourmand.",
            tags: ["vanille", "madagascar", "premium"],
        },
        {
            id: "tk-noir-16",
            title: "Vanille TK (Noir) — 16 cm",
            slug: "vanille-tk-noir-16cm",
            subtitle: "Pour pâtisserie fine & cadeaux gourmands",
            price: 500, // 5.00€ (le tube)
            sku: "VAN-TK-16",
            stock: 50,
            images: ["/photos-produit-vanille/photos-vanille-16-cm/img_8401.jpg", "/photos-produit-vanille/photos-vanille-16-cm/img_8442.jpg"],
            description: "Longueur premium (présentation & intensité). Parfait pour entremets, crèmes, glaces.",
            tags: ["vanille", "chef", "premium"],
        },
        {
            id: "tk-noir-17-18",
            title: "Vanille TK (Noir) — 17–18 cm",
            slug: "vanille-tk-noir-17-18cm",
            subtitle: "Format premium (pro & passionnés)",
            price: 500, // 5.00€ (le tube)
            sku: "VAN-TK-1718",
            stock: 30,
            images: ["/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8403.jpg", "/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8427.jpg", "/photos-produit-vanille/photos-vanille-18-et-17-cm/img_8435.jpg"],
            description: "Longue gousse, expérience haut de gamme. Pour pâtissiers, chefs, cadeaux.",
            tags: ["vanille", "madagascar", "exclusive"],
        },
        {
            id: "pack-decouverte",
            title: "Pack Découverte",
            slug: "pack-decouverte",
            subtitle: "Tester plusieurs longueurs (mix)",
            price: 2900,
            sku: "VAN-PACK-DEC",
            stock: 40,
            images: ["/photos-produit-vanille/galerie-photos-qui-sommes-nous/vanilles-traitees.jpg"],
            description: "Assortiment de gousses (tailles variées). Pour trouver votre profil aromatique.",
            tags: ["pack", "decouverte", "vanille"],
        },
        {
            id: "poivre-sauvage",
            title: "Poivre Sauvage de Madagascar",
            slug: "poivre-sauvage-madagascar",
            subtitle: "L’Expression Pure du Terroir Malgache",
            price: 1000,
            sku: "POIVRE-SAUVAGE",
            stock: 50,
            images: ["/photos-produit-vanille/poivre-sauvage-madagascar.jpg"],
            description: "Récolte artisanale à la main. Notes boisées & chaleur subtile. Origine : Madagascar (Nosy-Be).",
            tags: ["poivre", "sauvage", "madagascar"],
        }
    ];

    for (const prod of vanillaProducts) {
        await prisma.product.create({
            data: {
                title: prod.title,
                slug: prod.slug,
                sku: prod.sku,
                description: prod.description + "\n\n" + prod.subtitle,
                price: prod.price,
                stock: prod.stock,
                images: prod.images,
                tags: prod.tags,
                published: true,
                collectionId: collection.id,
            },
        });
    }

    console.log(`✅ Created ${vanillaProducts.length} products`);
    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
