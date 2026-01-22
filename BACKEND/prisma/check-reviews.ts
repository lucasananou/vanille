import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const totalReviews = await prisma.review.count();
    const totalProducts = await prisma.product.count();
    console.log(`Total products: ${totalProducts}`);
    console.log(`Total reviews: ${totalReviews}`);

    const reviewsPerProduct = await prisma.review.groupBy({
        by: ['productId'],
        _count: true,
    });

    console.log(`Products with reviews: ${reviewsPerProduct.length}`);

    const productsWithoutReviews = totalProducts - reviewsPerProduct.length;
    console.log(`Products without reviews: ${productsWithoutReviews}`);

    if (reviewsPerProduct.length > 0) {
        const min = Math.min(...reviewsPerProduct.map(r => r._count));
        const max = Math.max(...reviewsPerProduct.map(r => r._count));
        const avg = totalReviews / reviewsPerProduct.length;
        console.log(`Min reviews per product: ${min}`);
        console.log(`Max reviews per product: ${max}`);
        console.log(`Avg reviews per product: ${avg.toFixed(2)}`);
    }

    const statusDistribution = await prisma.review.groupBy({
        by: ['status'],
        _count: true,
    });
    console.log('Status distribution:');
    console.log(JSON.stringify(statusDistribution, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
