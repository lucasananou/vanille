
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding shipping zones and rates...');

    // Clear existing rates
    await prisma.shippingRate.deleteMany();
    await prisma.shippingZone.deleteMany();

    // Create Europe/France Zone
    const franceZone = await prisma.shippingZone.upsert({
        where: { id: 'france-zone' },
        update: {},
        create: {
            id: 'france-zone',
            name: 'France & Europe',
            countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES'],
            active: true,
        },
    });

    // Create Rates for France
    const rates = [
        {
            name: 'Lettre Suivie (Recommandé pour gousses)',
            price: 350, // 3.50€
            estimatedDays: '3-5 jours ouvrés',
        },
        {
            name: 'Colissimo Domicile',
            price: 695, // 6.95€
            estimatedDays: '2-3 jours ouvrés',
        },
        {
            name: 'Colissimo Point Retrait',
            price: 490, // 4.90€
            estimatedDays: '3-4 jours ouvrés',
        },
        {
            name: 'Livraison Gratuite (Dès 75€)',
            price: 0,
            minOrderValue: 7500, // 75.00€
            estimatedDays: '3-5 jours ouvrés',
        }
    ];

    for (const rate of rates) {
        await prisma.shippingRate.create({
            data: {
                ...rate,
                zoneId: franceZone.id,
                active: true,
            },
        });
    }

    console.log('Shipping seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
