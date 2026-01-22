import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- PRODUCT & REVIEWS DEBUG ---');

    // Check first 5 products and their review counts
    const products = await prisma.product.findMany({
        take: 5,
        include: {
            _count: {
                select: { reviews: true }
            }
        }
    });

    console.log('Sample Products:');
    products.forEach(p => {
        console.log(`- Title: ${p.title}`);
        console.log(`  Slug: ${p.slug}`);
        console.log(`  Review Count: ${p._count.reviews}`);
    });

    // Try a specific slug from the frontend logs
    const targetSlug = 'robes-volants-tsniout';
    const productBySlug = await prisma.product.findUnique({
        where: { slug: targetSlug },
        include: {
            _count: {
                select: { reviews: true }
            },
            reviews: {
                where: { status: 'APPROVED' },
                take: 1
            }
        }
    });

    if (productBySlug) {
        console.log(`\nFound product by slug "${targetSlug}":`);
        console.log(`- ID: ${productBySlug.id}`);
        console.log(`- Approved reviews count: ${productBySlug._count.reviews}`);
        console.log(`- Sample review: ${JSON.stringify(productBySlug.reviews[0], null, 2)}`);
    } else {
        console.log(`\nProduct with slug "${targetSlug}" NOT FOUND in database.`);

        // Let's find similar slugs
        const similarProducts = await prisma.product.findMany({
            where: {
                slug: {
                    contains: targetSlug.split('-')[0]
                }
            },
            take: 3
        });
        console.log('Similar slugs found:');
        similarProducts.forEach(p => console.log(`- ${p.slug}`));
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
