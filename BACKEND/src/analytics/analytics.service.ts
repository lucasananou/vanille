import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getAdminSummary() {
        // Get basic stats
        const [totalOrders, totalRevenue, totalProducts, totalCustomers] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { total: true },
            }),
            this.prisma.product.count(),
            this.prisma.order.groupBy({
                by: ['email'],
            }),
        ]);

        // Recent orders
        const recentOrders = await this.prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                email: true,
                status: true,
                total: true,
                createdAt: true,
            },
        });

        // Top products (mock for now - would need to aggregate order items)
        const topProducts = await this.prisma.product.findMany({
            take: 5,
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                stock: true,
            },
        });

        return {
            summary: {
                totalOrders,
                totalRevenue: totalRevenue._sum.total || 0,
                totalProducts,
                totalCustomers: totalCustomers.length,
                averageOrderValue: totalOrders > 0
                    ? Math.round((totalRevenue._sum.total || 0) / totalOrders)
                    : 0,
            },
            recentOrders,
            topProducts,
            lastUpdated: new Date().toISOString(),
        };
    }
}
