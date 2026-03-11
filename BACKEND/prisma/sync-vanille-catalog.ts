import { PrismaClient } from '@prisma/client';
import { VANILLE_PRODUCTS } from './vanille-catalog';

const prisma = new PrismaClient();

async function ensureCollection(product: (typeof VANILLE_PRODUCTS)[number]) {
  return prisma.collection.upsert({
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
}

async function syncProduct(product: (typeof VANILLE_PRODUCTS)[number]) {
  const collection = await ensureCollection(product);

  const existing = await prisma.product.findFirst({
    where: {
      OR: [{ slug: product.slug }, { sku: product.sku }],
    },
    select: { id: true },
  });

  const baseData = {
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    description: `${product.description}\n\n${product.subtitle}`,
    price: product.price,
    stock: product.stock,
    images: product.images,
    tags: product.tags,
    published: true,
    collectionId: collection.id,
  };

  const record = existing
    ? await prisma.product.update({
        where: { id: existing.id },
        data: baseData,
      })
    : await prisma.product.create({
        data: baseData,
      });

  await prisma.productVariant.deleteMany({ where: { productId: record.id } });
  await prisma.productOption.deleteMany({ where: { productId: record.id } });

  if (product.options?.length) {
    await prisma.productOption.createMany({
      data: product.options.map((option) => ({
        productId: record.id,
        name: option.name,
        values: option.values,
        position: option.position,
      })),
    });
  }

  if (product.variants?.length) {
    await prisma.productVariant.createMany({
      data: product.variants.map((variant) => ({
        productId: record.id,
        sku: variant.sku,
        title: variant.title,
        price: variant.price,
        stock: variant.stock,
        image: variant.image,
        options: variant.options,
        published: true,
      })),
    });
  }

  return {
    slug: product.slug,
    variants: product.variants?.length ?? 0,
    options: product.options?.length ?? 0,
  };
}

async function main() {
  console.log('Syncing vanille catalog...');
  const results: Array<{ slug: string; variants: number; options: number }> = [];
  for (const product of VANILLE_PRODUCTS) {
    results.push(await syncProduct(product));
  }
  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch((error) => {
    console.error('Vanille sync failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
