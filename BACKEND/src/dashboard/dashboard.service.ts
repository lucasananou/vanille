import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    // Get comprehensive dashboard overview
    async getDashboardOverview() {
        const [
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            recentOrders,
            topProducts,
        ] = await Promise.all([
            this.getTotalRevenue().catch(e => { console.error('Revenue Error:', e); return { total: 0, orderCount: 0 }; }),
            this.getTotalOrders().catch(e => { console.error('Orders Error:', e); return { total: 0, pending: 0, paid: 0, shipped: 0 }; }),
            this.getTotalCustomers().catch(e => { console.error('Customers Error:', e); return { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 }; }),
            this.getTotalProducts().catch(e => { console.error('Products Error:', e); return { total: 0, published: 0, outOfStock: 0 }; }),
            this.getRecentOrders(5).catch(e => { console.error('Recent Orders Error:', e); return []; }),
            this.getTopSellingProducts(5).catch(e => { console.error('Top Products Error:', e); return []; }),
        ]);

        return {
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
            products: totalProducts,
            recentOrders,
            topProducts,
        };
    }

    // Revenue metrics
    async getTotalRevenue() {
        const result = await this.prisma.order.aggregate({
            where: { status: 'PAID' },
            _sum: { total: true },
            _count: { _all: true },
        });

        return {
            total: result._sum.total || 0,
            orderCount: result._count._all || 0,
        };
    }

    // Revenue over time (last 30 days)
    async getRevenueOverTime(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const orders = await this.prisma.order.findMany({
            where: {
                status: 'PAID',
                createdAt: { gte: startDate },
            },
            select: {
                total: true,
                createdAt: true,
            },
        });

        // Group by day
        const revenueByDay: Record<string, number> = {};
        orders.forEach(order => {
            const day = order.createdAt.toISOString().split('T')[0];
            revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
        });

        return Object.entries(revenueByDay).map(([date, revenue]) => ({
            date,
            revenue,
        }));
    }

    // Order metrics
    async getTotalOrders() {
        const [total, pending, paid, shipped] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: 'PENDING' } }),
            this.prisma.order.count({ where: { status: 'PAID' } }),
            this.prisma.order.count({ where: { status: 'SHIPPED' } }),
        ]);

        return { total, pending, paid, shipped };
    }

    // Recent orders
    async getRecentOrders(limit = 10) {
        return this.prisma.order.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                customer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    // Customer metrics
    async getTotalCustomers() {
        const [total, thisMonth, lastMonth] = await Promise.all([
            this.prisma.customer.count(),
            this.getCustomersInPeriod(30),
            this.getCustomersInPeriod(60, 30),
        ]);

        const growth = lastMonth > 0
            ? ((thisMonth - lastMonth) / lastMonth) * 100
            : 0;

        return {
            total,
            thisMonth,
            lastMonth,
            growth: Math.round(growth * 10) / 10,
        };
    }

    private async getCustomersInPeriod(daysAgo: number, endDaysAgo = 0) {
        const start = new Date();
        start.setDate(start.getDate() - daysAgo);

        const end = new Date();
        end.setDate(end.getDate() - endDaysAgo);

        return this.prisma.customer.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });
    }

    // Product metrics
    async getTotalProducts() {
        const [total, published, outOfStock] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.count({ where: { published: true } }),
            this.prisma.product.count({ where: { stock: 0 } }),
        ]);

        return { total, published, outOfStock };
    }

    // Top selling products
    async getTopSellingProducts(limit = 10) {
        const topProducts = await this.prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            _count: { productId: true },
            orderBy: {
                _sum: { quantity: 'desc' },
            },
            take: limit,
        });

        const productIds = topProducts.map(p => p.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        return topProducts.map(tp => {
            const product = products.find(p => p.id === tp.productId);
            return {
                product,
                quantitySold: tp._sum.quantity,
                orderCount: tp._count.productId,
            };
        });
    }

    // Sales by collection
    async getSalesByCollection() {
        const orders = await this.prisma.orderItem.findMany({
            include: {
                product: {
                    select: {
                        collectionId: true,
                        collection: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const salesByCollection: Record<string, { name: string; revenue: number; count: number }> = {};

        orders.forEach(item => {
            // Safety check in case product was deleted
            if (!item.product) return;

            const collectionId = item.product.collectionId;
            const collectionName = item.product.collection?.name || 'Uncategorized';
            const key = collectionId || 'none';

            if (!salesByCollection[key]) {
                salesByCollection[key] = {
                    name: collectionName,
                    revenue: 0,
                    count: 0,
                };
            }

            salesByCollection[key].revenue += (item.price || 0) * (item.quantity || 0);
            salesByCollection[key].count += item.quantity || 0;
        });

        return Object.values(salesByCollection).sort((a, b) => b.revenue - a.revenue);
    }

    // Average order value
    async getAverageOrderValue() {
        const result = await this.prisma.order.aggregate({
            where: { status: 'PAID' },
            _avg: { total: true },
        });

        return {
            averageOrderValue: Math.round(result._avg.total || 0),
        };
    }

    // Conversion rate (orders / customers with orders)
    async getConversionMetrics() {
        const [totalCustomers, customersWithOrders] = await Promise.all([
            this.prisma.customer.count(),
            this.prisma.customer.count({
                where: {
                    orders: {
                        some: { status: 'PAID' },
                    },
                },
            }),
        ]);

        const conversionRate = totalCustomers > 0
            ? (customersWithOrders / totalCustomers) * 100
            : 0;

        return {
            totalCustomers,
            customersWithOrders,
            conversionRate: Math.round(conversionRate * 10) / 10,
        };
    }
}
