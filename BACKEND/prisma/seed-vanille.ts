
import { PrismaClient } from '@prisma/client';
import { VANILLE_PRODUCTS } from './vanille-catalog';

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

    const collections = new Map<string, string>();
    for (const product of VANILLE_PRODUCTS) {
        if (!collections.has(product.collectionSlug)) {
            const collection = await prisma.collection.upsert({
                where: { slug: product.collectionSlug },
                update: {
                    name: product.collectionName,
                    description: product.collectionDescription,
                    published: true,
                },
                create: {
                    name: product.collectionName,
                    slug: product.collectionSlug,
                    description: product.collectionDescription,
                    published: true,
                },
            });
            collections.set(product.collectionSlug, collection.id);
        }
    }
    console.log(`✅ Created ${collections.size} collections`);

    for (const product of VANILLE_PRODUCTS) {
        await prisma.product.create({
            data: {
                title: product.title,
                slug: product.slug,
                sku: product.sku,
                description: `${product.description}\n\n${product.subtitle}`,
                price: product.price,
                stock: product.stock,
                images: product.images,
                tags: product.tags,
                published: true,
                collectionId: collections.get(product.collectionSlug)!,
                options: product.options
                    ? {
                          create: product.options,
                      }
                    : undefined,
                variants: product.variants
                    ? {
                          create: product.variants.map((variant) => ({
                              sku: variant.sku,
                              title: variant.title,
                              price: variant.price,
                              stock: variant.stock,
                              image: variant.image,
                              options: variant.options,
                              published: true,
                          })),
                      }
                    : undefined,
            },
        });
    }

    console.log(`✅ Created ${VANILLE_PRODUCTS.length} products`);
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
