import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const email = process.env.LOCAL_ADMIN_EMAIL || 'admin@ecommerce.local';
const password = process.env.LOCAL_ADMIN_PASSWORD || 'admin123';

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error(
            'DATABASE_URL is missing. Create BACKEND/.env from .env.example and set DATABASE_URL before running this command.',
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Admin User',
        },
        create: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
            name: 'Admin User',
        },
    });

    console.log(`Local admin ready: ${admin.email}`);
    console.log('Password reset completed.');
}

main()
    .catch((error) => {
        console.error('Failed to reset local admin:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
