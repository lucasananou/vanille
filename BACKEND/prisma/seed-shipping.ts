
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding shipping zones and rates...');

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
            name: 'La Poste - Colissimo (Standard)',
            price: 690, // 6.90€
            estimatedDays: '3-5 jours ouvrés',
        },
        {
            name: 'DHL Express (Rapide)',
            price: 1490, // 14.90€
            estimatedDays: '1-2 jours ouvrés',
        },
        {
            name: 'Livraison Gratuite (Dès 100€)',
            price: 0,
            minOrderValue: 10000,
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
