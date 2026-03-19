
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedShippingRate = {
    id: string;
    name: string;
    price: number;
    minOrderValue?: number;
    estimatedDays?: string;
};

type SeedShippingZone = {
    id: string;
    name: string;
    countries: string[];
    rates: SeedShippingRate[];
};

const SHIPPING_ZONES: SeedShippingZone[] = [
    {
        id: 'france-zone',
        name: 'France & Europe',
        countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'IT', 'ES'],
        rates: [
            {
                id: 'fr-letter-tracked',
                name: 'Lettre Suivie (Recommandé pour gousses)',
                price: 350,
                estimatedDays: '3-5 jours ouvrés',
            },
            {
                id: 'fr-colissimo-home',
                name: 'Colissimo Domicile',
                price: 695,
                estimatedDays: '2-3 jours ouvrés',
            },
            {
                id: 'fr-colissimo-pickup',
                name: 'Colissimo Point Retrait',
                price: 490,
                estimatedDays: '3-4 jours ouvrés',
            },
            {
                id: 'fr-free-shipping',
                name: 'Livraison Gratuite (Dès 75€)',
                price: 0,
                minOrderValue: 7500,
                estimatedDays: '3-5 jours ouvrés',
            },
        ],
    },
    {
        id: 'usa-zone',
        name: 'États-Unis',
        countries: ['US'],
        rates: [
            {
                id: 'us-colissimo-intl',
                name: 'Colissimo International USA',
                price: 2890,
                estimatedDays: '5-8 jours ouvrés',
            },
        ],
    },
];

async function main() {
    console.log('Seeding shipping zones and rates...');

    for (const zone of SHIPPING_ZONES) {
        await prisma.shippingZone.upsert({
            where: { id: zone.id },
            update: {
                name: zone.name,
                countries: [...zone.countries],
                regions: [],
                active: true,
            },
            create: {
                id: zone.id,
                name: zone.name,
                countries: [...zone.countries],
                regions: [],
                active: true,
            },
        });

        for (const rate of zone.rates) {
            await prisma.shippingRate.upsert({
                where: { id: rate.id },
                update: {
                    zoneId: zone.id,
                    name: rate.name,
                    price: rate.price,
                    minOrderValue: rate.minOrderValue ?? null,
                    maxOrderValue: null,
                    estimatedDays: rate.estimatedDays,
                    active: true,
                },
                create: {
                    id: rate.id,
                    zoneId: zone.id,
                    name: rate.name,
                    price: rate.price,
                    minOrderValue: rate.minOrderValue ?? null,
                    maxOrderValue: null,
                    estimatedDays: rate.estimatedDays,
                    active: true,
                },
            });
        }
    }

    await prisma.shippingRate.updateMany({
        where: {
            zoneId: { in: SHIPPING_ZONES.map((zone) => zone.id) },
            id: {
                notIn: SHIPPING_ZONES.flatMap((zone) => zone.rates.map((rate) => rate.id)),
            },
        },
        data: {
            active: false,
        },
    });

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
