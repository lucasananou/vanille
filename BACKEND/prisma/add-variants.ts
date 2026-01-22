import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const collectionSlug = 'robe-tsniout';
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

    for (const product of collection.products) {
        console.log(`Processing product: ${product.title} (${product.sku})`);

        // 1. Clean up existing options and variants to avoid duplicates/conflicts
        await prisma.productVariant.deleteMany({ where: { productId: product.id } });
        await prisma.productOption.deleteMany({ where: { productId: product.id } });

        // 2. Create "Taille" Option
        await prisma.productOption.create({
            data: {
                productId: product.id,
                name: 'Taille',
                values: sizes,
                position: 0
            }
        });

        // 3. Create Variants
        for (const size of sizes) {
            const variantSku = `${product.sku}-${size}`;

            await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    title: size,
                    sku: variantSku,
                    price: product.price, // Inherit current price (3900)
                    compareAtPrice: product.compareAtPrice, // Inherit compare price (5900)
                    stock: 10, // Default stock
                    options: {
                        "Taille": size
                    },
                    published: true
                }
            });
        }

        // Update main product stock to sum of variants
        await prisma.product.update({
            where: { id: product.id },
            data: { stock: sizes.length * 10 }
        });
    }

    console.log('Successfully added variants to all dresses!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
