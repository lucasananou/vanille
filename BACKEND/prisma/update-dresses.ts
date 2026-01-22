import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const collectionSlug = 'robe-tsniout';
    const newPrice = 3900; // 39.00€
    const newCompareAtPrice = 5900; // 59.00€

    console.log(`Finding collection: ${collectionSlug}...`);
    const collection = await prisma.collection.findUnique({
        where: { slug: collectionSlug },
        include: { products: true }
    });

    if (!collection) {
        console.error(`Collection ${collectionSlug} not found!`);
        return;
    }

    console.log(`Found collection: ${collection.name} with ${collection.products.length} products.`);

    // Update products directly linked to this collection
    console.log('Updating products...');
    const updatedProducts = await prisma.product.updateMany({
        where: { collectionId: collection.id },
        data: {
            price: newPrice,
            compareAtPrice: newCompareAtPrice
        }
    });
    console.log(`Updated ${updatedProducts.count} products.`);

    // Update variants for these products to match
    // We need to fetch product IDs first to update variants
    const products = await prisma.product.findMany({
        where: { collectionId: collection.id },
        select: { id: true }
    });

    const productIds = products.map(p => p.id);

    if (productIds.length > 0) {
        console.log('Updating variants...');
        const updatedVariants = await prisma.productVariant.updateMany({
            where: { productId: { in: productIds } },
            data: {
                price: newPrice,
                compareAtPrice: newCompareAtPrice
            }
        });
        console.log(`Updated ${updatedVariants.count} variants.`);
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
