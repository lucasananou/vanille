import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@ecommerce.local' },
        update: {},
        create: {
            email: 'admin@ecommerce.local',
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Admin User',
        },
    });
    console.log('✅ Created admin:', admin.email);

    // Create collections
    const robes = await prisma.collection.upsert({
        where: { slug: 'robe-tsniout' },
        update: {},
        create: {
            name: 'Robes Tsniout',
            slug: 'robe-tsniout',
            description: 'Robes élégantes et pudiques',
            published: true,
        },
    });

    const jupes = await prisma.collection.upsert({
        where: { slug: 'jupe-longue-tsniout' },
        update: {},
        create: {
            name: 'Jupes Longues',
            slug: 'jupe-longue-tsniout',
            description: 'Jupes longues et midi',
            published: true,
        },
    });

    console.log('✅ Created Tsniout collections');

    // Create products
    const products = [
        {
            title: 'Robe Captivante Bleu Nuit',
            slug: 'robe-captivante-bleu-nuit',
            sku: 'RBN-001',
            description: 'Une robe longue en satin bleu nuit, idéale pour les grandes occasions.',
            price: 12900,
            stock: 15,
            images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
            tags: ['robe', 'soiree', 'bleu'],
            published: true,
            collectionId: robes.id,
        },
        {
            title: 'Robe Fleurie Printemps',
            slug: 'robe-fleurie-printemps',
            sku: 'RFP-002',
            description: 'Robe légère à motifs floraux, parfaite pour le quotidien.',
            price: 7900,
            stock: 25,
            images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'],
            tags: ['robe', 'printemps', 'fleurs'],
            published: true,
            collectionId: robes.id,
        },
        {
            title: 'Robe Noire Intemporelle',
            slug: 'robe-noire-intemporelle',
            sku: 'RNI-003',
            description: 'La petite robe noire version modeste, un classique.',
            price: 8900,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800'],
            tags: ['robe', 'noir', 'classique'],
            published: true,
            collectionId: robes.id,
        },
        {
            title: 'Jupe Plissée Soleil',
            slug: 'jupe-plissee-soleil',
            sku: 'JPS-001',
            description: 'Jupe plissée dorée, très tendance.',
            price: 6500,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'],
            tags: ['jupe', 'plissee', 'or'],
            published: true,
            collectionId: jupes.id,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }

    console.log(`✅ Created ${products.length} products`);
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
