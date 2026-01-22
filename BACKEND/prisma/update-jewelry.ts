import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const collectionSlug = 'collier';
    const newPrice = 1900; // 19.00€
    const newCompareAtPrice = 3900; // 39.00€

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

    for (const product of collection.products) {
        console.log(`Updating product: ${product.title} (${product.sku})`);

        // 1. Update Product Price
        await prisma.product.update({
            where: { id: product.id },
            data: {
                price: newPrice,
                compareAtPrice: newCompareAtPrice,
                stock: 50 // Default stock for simple products
            }
        });

        // 2. Remove all variants and options (making it a simple product)
        await prisma.productVariant.deleteMany({
            where: { productId: product.id }
        });

        await prisma.productOption.deleteMany({
            where: { productId: product.id }
        });
    }

    console.log('Successfully updated all jewelry!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
