import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSign } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

type GoogleAnalyticsSummary = {
    configured: boolean;
    propertyId?: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    averageSessionDuration: number;
    bounceRate: number;
    periodLabel: string;
    error?: string;
};

type GoogleAnalyticsRow = {
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
};

type GoogleAnalyticsReportResponse = {
    rows?: GoogleAnalyticsRow[];
};

type GoogleAnalyticsSeriesPoint = {
    date: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
};

type GoogleAnalyticsBreakdownRow = {
    label: string;
    value: number;
    secondaryValue?: number;
};

type GoogleAnalyticsEventRow = {
    eventName: string;
    eventCount: number;
    users: number;
};

type GoogleAnalyticsDashboard = {
    configured: boolean;
    propertyId?: string;
    periodLabel: string;
    summary: GoogleAnalyticsSummary;
    timeseries: GoogleAnalyticsSeriesPoint[];
    channels: GoogleAnalyticsBreakdownRow[];
    topPages: GoogleAnalyticsBreakdownRow[];
    countries: GoogleAnalyticsBreakdownRow[];
    devices: GoogleAnalyticsBreakdownRow[];
    events: GoogleAnalyticsEventRow[];
    error?: string;
};

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    // Get comprehensive dashboard overview
    async getDashboardOverview() {
        const [
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            averageOrderValue,
            conversionMetrics,
            googleAnalytics,
            recentOrders,
            topProducts,
        ] = await Promise.all([
            this.getTotalRevenue().catch(e => { console.error('Revenue Error:', e); return { total: 0, orderCount: 0 }; }),
            this.getTotalOrders().catch(e => { console.error('Orders Error:', e); return { total: 0, pending: 0, paid: 0, shipped: 0 }; }),
            this.getTotalCustomers().catch(e => { console.error('Customers Error:', e); return { total: 0, thisMonth: 0, lastMonth: 0, growth: 0 }; }),
            this.getTotalProducts().catch(e => { console.error('Products Error:', e); return { total: 0, published: 0, outOfStock: 0 }; }),
            this.getAverageOrderValue().catch(e => { console.error('Average Order Value Error:', e); return { averageOrderValue: 0 }; }),
            this.getConversionMetrics().catch(e => { console.error('Conversion Error:', e); return { totalCustomers: 0, customersWithOrders: 0, conversionRate: 0 }; }),
            this.getGoogleAnalyticsSummary().catch(e => {
                console.error('Google Analytics Error:', e);
                return {
                    configured: false,
                    activeUsers: 0,
                    sessions: 0,
                    pageViews: 0,
                    averageSessionDuration: 0,
                    bounceRate: 0,
                    periodLabel: '30 derniers jours',
                    error: 'Impossible de charger les statistiques Google Analytics.',
                } satisfies GoogleAnalyticsSummary;
            }),
            this.getRecentOrders(5).catch(e => { console.error('Recent Orders Error:', e); return []; }),
            this.getTopSellingProducts(5).catch(e => { console.error('Top Products Error:', e); return []; }),
        ]);

        const [revenueChange, ordersChange] = await Promise.all([
            this.getRevenueChangePercentage().catch(e => { console.error('Revenue Change Error:', e); return 0; }),
            this.getOrdersChangePercentage().catch(e => { console.error('Orders Change Error:', e); return 0; }),
        ]);

        return {
            totalRevenue: totalRevenue.total,
            totalOrders: totalOrders.total,
            totalCustomers: totalCustomers.total,
            totalProducts: totalProducts.total,
            revenueChange,
            ordersChange,
            customersChange: totalCustomers.growth,
            averageOrderValue: averageOrderValue.averageOrderValue,
            conversionRate: conversionMetrics.conversionRate,
            googleAnalytics,
            revenue: totalRevenue,
            orders: totalOrders,
            customers: totalCustomers,
            products: totalProducts,
            recentOrders,
            topProducts,
        };
    }

    private async getRevenueChangePercentage() {
        const [current, previous] = await Promise.all([
            this.getRevenueInPeriod(30),
            this.getRevenueInPeriod(60, 30),
        ]);

        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }

        return Math.round((((current - previous) / previous) * 100) * 10) / 10;
    }

    private async getOrdersChangePercentage() {
        const [current, previous] = await Promise.all([
            this.getOrderCountInPeriod(30),
            this.getOrderCountInPeriod(60, 30),
        ]);

        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }

        return Math.round((((current - previous) / previous) * 100) * 10) / 10;
    }

    private async getRevenueInPeriod(daysAgo: number, endDaysAgo = 0) {
        const start = new Date();
        start.setDate(start.getDate() - daysAgo);

        const end = new Date();
        end.setDate(end.getDate() - endDaysAgo);

        const result = await this.prisma.order.aggregate({
            where: {
                status: 'PAID',
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: { total: true },
        });

        return result._sum.total || 0;
    }

    private async getOrderCountInPeriod(daysAgo: number, endDaysAgo = 0) {
        const start = new Date();
        start.setDate(start.getDate() - daysAgo);

        const end = new Date();
        end.setDate(end.getDate() - endDaysAgo);

        return this.prisma.order.count({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });
    }

    private async getGoogleAnalyticsSummary(): Promise<GoogleAnalyticsSummary> {
        const config = this.getGoogleAnalyticsConfig();
        if (!config) {
            return this.getGoogleAnalyticsUnavailableSummary();
        }

        const data = await this.runGoogleAnalyticsReport(config, {
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
        });

        const metrics = data.rows?.[0]?.metricValues ?? [];

        return {
            configured: true,
            propertyId: config.propertyId,
            activeUsers: this.parseMetricValue(metrics[0]?.value),
            sessions: this.parseMetricValue(metrics[1]?.value),
            pageViews: this.parseMetricValue(metrics[2]?.value),
            averageSessionDuration: this.parseMetricValue(metrics[3]?.value),
            bounceRate: this.parseMetricValue(metrics[4]?.value),
            periodLabel: '30 derniers jours',
        };
    }

    async getGoogleAnalyticsDashboard(): Promise<GoogleAnalyticsDashboard> {
        const config = this.getGoogleAnalyticsConfig();
        if (!config) {
            return {
                configured: false,
                propertyId: this.configService.get<string>('GOOGLE_ANALYTICS_PROPERTY_ID') || undefined,
                periodLabel: '30 derniers jours',
                summary: this.getGoogleAnalyticsUnavailableSummary(),
                timeseries: [],
                channels: [],
                topPages: [],
                countries: [],
                devices: [],
                events: [],
                error: 'Configuration Google Analytics incomplète côté serveur.',
            };
        }

        try {
            const [summary, timeseriesReport, channelsReport, topPagesReport, countriesReport, devicesReport, eventsReport] = await Promise.all([
                this.getGoogleAnalyticsSummary(),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'date' }],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'sessions' },
                        { name: 'screenPageViews' },
                    ],
                    orderBys: [{ dimension: { dimensionName: 'date' } }],
                    limit: 31,
                }),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
                    metrics: [
                        { name: 'sessions' },
                        { name: 'activeUsers' },
                    ],
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
                    limit: 8,
                }),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'pagePath' }],
                    metrics: [
                        { name: 'screenPageViews' },
                        { name: 'activeUsers' },
                    ],
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                    limit: 10,
                }),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'country' }],
                    metrics: [{ name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
                    limit: 8,
                }),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'deviceCategory' }],
                    metrics: [{ name: 'activeUsers' }],
                    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
                    limit: 8,
                }),
                this.runGoogleAnalyticsReport(config, {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'eventName' }],
                    metrics: [
                        { name: 'eventCount' },
                        { name: 'activeUsers' },
                    ],
                    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
                    limit: 10,
                }),
            ]);

            return {
                configured: true,
                propertyId: config.propertyId,
                periodLabel: '30 derniers jours',
                summary,
                timeseries: (timeseriesReport.rows ?? []).map((row) => ({
                    date: this.formatGoogleAnalyticsDate(row.dimensionValues?.[0]?.value),
                    activeUsers: this.parseMetricValue(row.metricValues?.[0]?.value),
                    sessions: this.parseMetricValue(row.metricValues?.[1]?.value),
                    pageViews: this.parseMetricValue(row.metricValues?.[2]?.value),
                })),
                channels: (channelsReport.rows ?? []).map((row) => ({
                    label: row.dimensionValues?.[0]?.value || 'Non défini',
                    value: this.parseMetricValue(row.metricValues?.[0]?.value),
                    secondaryValue: this.parseMetricValue(row.metricValues?.[1]?.value),
                })),
                topPages: (topPagesReport.rows ?? []).map((row) => ({
                    label: row.dimensionValues?.[0]?.value || '/',
                    value: this.parseMetricValue(row.metricValues?.[0]?.value),
                    secondaryValue: this.parseMetricValue(row.metricValues?.[1]?.value),
                })),
                countries: (countriesReport.rows ?? []).map((row) => ({
                    label: row.dimensionValues?.[0]?.value || 'Non défini',
                    value: this.parseMetricValue(row.metricValues?.[0]?.value),
                })),
                devices: (devicesReport.rows ?? []).map((row) => ({
                    label: row.dimensionValues?.[0]?.value || 'Non défini',
                    value: this.parseMetricValue(row.metricValues?.[0]?.value),
                })),
                events: (eventsReport.rows ?? []).map((row) => ({
                    eventName: row.dimensionValues?.[0]?.value || 'unknown',
                    eventCount: this.parseMetricValue(row.metricValues?.[0]?.value),
                    users: this.parseMetricValue(row.metricValues?.[1]?.value),
                })),
            };
        } catch (error) {
            console.error('Google Analytics dashboard error:', error);
            return {
                configured: false,
                propertyId: config.propertyId,
                periodLabel: '30 derniers jours',
                summary: {
                    ...this.getGoogleAnalyticsUnavailableSummary(),
                    propertyId: config.propertyId,
                    error: error instanceof Error ? error.message : 'Impossible de charger les statistiques Google Analytics.',
                },
                timeseries: [],
                channels: [],
                topPages: [],
                countries: [],
                devices: [],
                events: [],
                error: error instanceof Error ? error.message : 'Impossible de charger les statistiques Google Analytics.',
            };
        }
    }

    private async getGoogleAccessToken(clientEmail: string, privateKey: string) {
        const issuedAt = Math.floor(Date.now() / 1000);
        const expiresAt = issuedAt + 3600;
        const audience = 'https://oauth2.googleapis.com/token';

        const unsignedToken = [
            this.base64UrlEncode({ alg: 'RS256', typ: 'JWT' }),
            this.base64UrlEncode({
                iss: clientEmail,
                scope: 'https://www.googleapis.com/auth/analytics.readonly',
                aud: audience,
                exp: expiresAt,
                iat: issuedAt,
            }),
        ].join('.');

        const signer = createSign('RSA-SHA256');
        signer.update(unsignedToken);
        signer.end();

        const signature = this.base64UrlBuffer(
            signer.sign(privateKey.replace(/\\n/g, '\n')),
        );

        const assertion = `${unsignedToken}.${signature}`;

        const tokenResponse = await fetch(audience, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion,
            }),
        });

        if (!tokenResponse.ok) {
            const details = await tokenResponse.text();
            throw new Error(`OAuth token error ${tokenResponse.status}: ${details}`);
        }

        const tokenData = await tokenResponse.json() as { access_token: string };
        return tokenData.access_token;
    }

    private base64UrlEncode(value: object) {
        return this.base64UrlBuffer(Buffer.from(JSON.stringify(value)));
    }

    private base64UrlBuffer(value: Buffer) {
        return value
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }

    private parseMetricValue(value?: string) {
        if (!value) return 0;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    private getGoogleAnalyticsConfig() {
        const propertyId = this.configService.get<string>('GOOGLE_ANALYTICS_PROPERTY_ID');
        const clientEmail = this.configService.get<string>('GOOGLE_ANALYTICS_CLIENT_EMAIL');
        const privateKey = this.configService.get<string>('GOOGLE_ANALYTICS_PRIVATE_KEY');

        if (!propertyId || !clientEmail || !privateKey) {
            return null;
        }

        return { propertyId, clientEmail, privateKey };
    }

    private getGoogleAnalyticsUnavailableSummary(): GoogleAnalyticsSummary {
        return {
            configured: false,
            activeUsers: 0,
            sessions: 0,
            pageViews: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            periodLabel: '30 derniers jours',
            error: 'Configuration Google Analytics incomplète côté serveur.',
        };
    }

    private async runGoogleAnalyticsReport(
        config: { propertyId: string; clientEmail: string; privateKey: string },
        body: Record<string, unknown>,
    ): Promise<GoogleAnalyticsReportResponse> {
        const accessToken = await this.getGoogleAccessToken(config.clientEmail, config.privateKey);
        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${config.propertyId}:runReport`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            const details = await response.text();
            throw new Error(`GA Data API ${response.status}: ${details}`);
        }

        return response.json() as Promise<GoogleAnalyticsReportResponse>;
    }

    private formatGoogleAnalyticsDate(rawDate?: string) {
        if (!rawDate || rawDate.length !== 8) return rawDate || '';
        return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
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
