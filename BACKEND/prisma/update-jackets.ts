import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const collectionSlug = 'veste-tsniout';
    const newPrice = 4900; // 49.00€
    const newCompareAtPrice = 7900; // 79.00€
    const sizes = ['S', 'M', 'L', 'XL'];

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

    // 1. Update Base Product Prices
    console.log('Updating base product prices...');
    const updatedProducts = await prisma.product.updateMany({
        where: { collectionId: collection.id },
        data: {
            price: newPrice,
            compareAtPrice: newCompareAtPrice
        }
    });
    console.log(`Updated prices for ${updatedProducts.count} products.`);

    // 2. Add Variants
    for (const product of collection.products) {
        console.log(`Processing variants for: ${product.title} (${product.sku})`);

        // Clean up existing options and variants
        await prisma.productVariant.deleteMany({ where: { productId: product.id } });
        await prisma.productOption.deleteMany({ where: { productId: product.id } });

        // Create "Taille" Option
        await prisma.productOption.create({
            data: {
                productId: product.id,
                name: 'Taille',
                values: sizes,
                position: 0
            }
        });

        // Create Variants
        for (const size of sizes) {
            const variantSku = `${product.sku}-${size}`;

            await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    title: size,
                    sku: variantSku,
                    price: newPrice, // Set explicit variant price
                    compareAtPrice: newCompareAtPrice,
                    stock: 10, // Default stock
                    options: {
                        "Taille": size
                    },
                    published: true
                }
            });
        }

        // Update main product stock
        await prisma.product.update({
            where: { id: product.id },
            data: { stock: sizes.length * 10 }
        });
    }

    console.log('Successfully updated all jackets!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
