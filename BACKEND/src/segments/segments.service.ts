import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SegmentsService {
    constructor(private prisma: PrismaService) { }

    // Segment types
    private readonly SEGMENT_TYPES = {
        VIP: 'VIP', // High value customers (>5 orders or >$1000 total)
        AT_RISK: 'AT_RISK', // Haven't ordered in 90 days but had orders before
        NEW: 'NEW', // First order within last 30 days
        INACTIVE: 'INACTIVE', // No orders in 180 days
        LOYAL: 'LOYAL', // Regular customers (3+ orders)
        ONE_TIME: 'ONE_TIME', // Only 1 order ever
    };

    // Auto-assign segments to all customers
    async updateAllSegments() {
        const customers = await this.prisma.customer.findMany({
            include: {
                orders: {
                    where: {
                        status: 'PAID',
                    },
                },
            },
        });

        const updates = [];

        for (const customer of customers) {
            const segments = await this.calculateSegments(customer);

            // Remove old segments
            await this.prisma.customerSegment.deleteMany({
                where: { customerId: customer.id },
            });

            // Add new segments
            for (const segmentType of segments) {
                await this.prisma.customerSegment.create({
                    data: {
                        customerId: customer.id,
                        segmentType,
                    },
                });
            }
        }

        return {
            message: 'Segments updated for all customers',
            customersProcessed: customers.length,
        };
    }

    // Calculate segments for a customer
    private async calculateSegments(customer: any): Promise<string[]> {
        const segments: string[] = [];
        const orders = customer.orders;

        if (orders.length === 0) {
            return segments;
        }

        const totalSpent = orders.reduce((sum: number, o: any) => sum + o.total, 0);
        const orderCount = orders.length;
        const lastOrder = orders.reduce((latest: any, o: any) =>
            o.createdAt > latest.createdAt ? o : latest
            , orders[0]);
        const firstOrder = orders.reduce((earliest: any, o: any) =>
            o.createdAt < earliest.createdAt ? o : earliest
            , orders[0]);

        const now = new Date();
        const daysSinceLastOrder = Math.floor(
            (now.getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysSinceFirstOrder = Math.floor(
            (now.getTime() - new Date(firstOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );

        // VIP: High value
        if (orderCount >= 5 || totalSpent >= 100000) { // $1000 in cents
            segments.push(this.SEGMENT_TYPES.VIP);
        }

        // LOYAL: Regular customers
        if (orderCount >= 3 && !segments.includes(this.SEGMENT_TYPES.VIP)) {
            segments.push(this.SEGMENT_TYPES.LOYAL);
        }

        // NEW: Recent first purchase
        if (daysSinceFirstOrder <= 30) {
            segments.push(this.SEGMENT_TYPES.NEW);
        }

        // AT_RISK: Haven't ordered recently but are valuable
        if (daysSinceLastOrder > 90 && daysSinceLastOrder < 180 && orderCount > 1) {
            segments.push(this.SEGMENT_TYPES.AT_RISK);
        }

        // INACTIVE: Long time no purchase
        if (daysSinceLastOrder >= 180) {
            segments.push(this.SEGMENT_TYPES.INACTIVE);
        }

        // ONE_TIME: Only one order
        if (orderCount === 1 && daysSinceFirstOrder > 30) {
            segments.push(this.SEGMENT_TYPES.ONE_TIME);
        }

        return segments;
    }

    // Get customers by segment
    async getCustomersBySegment(segmentType: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [segments, total] = await Promise.all([
            this.prisma.customerSegment.findMany({
                where: { segmentType },
                skip,
                take: limit,
                include: {
                    customer: {
                        include: {
                            orders: {
                                where: { status: 'PAID' },
                                select: {
                                    id: true,
                                    total: true,
                                    createdAt: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    assignedAt: 'desc',
                },
            }),
            this.prisma.customerSegment.count({
                where: { segmentType },
            }),
        ]);

        return {
            customers: segments.map(s => ({
                ...s.customer,
                segmentAssignedAt: s.assignedAt,
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // Get segment statistics
    async getSegmentStats() {
        const allSegments = await this.prisma.customerSegment.findMany({
            include: {
                customer: {
                    include: {
                        orders: {
                            where: { status: 'PAID' },
                            select: {
                                total: true,
                            },
                        },
                    },
                },
            },
        });

        const stats: any = {};

        for (const segment of allSegments) {
            if (!stats[segment.segmentType]) {
                stats[segment.segmentType] = {
                    count: 0,
                    totalRevenue: 0,
                    avgOrderValue: 0,
                };
            }

            const totalRevenue = segment.customer.orders.reduce((sum, o) => sum + o.total, 0);
            stats[segment.segmentType].count++;
            stats[segment.segmentType].totalRevenue += totalRevenue;
        }

        // Calculate averages
        for (const type in stats) {
            if (stats[type].count > 0) {
                stats[type].avgOrderValue = Math.round(
                    stats[type].totalRevenue / stats[type].count
                );
            }
        }

        return stats;
    }

    // Update segments for a specific customer
    async updateCustomerSegments(customerId: string) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                orders: {
                    where: { status: 'PAID' },
                },
            },
        });

        if (!customer) {
            return { message: 'Customer not found' };
        }

        const segments = await this.calculateSegments(customer);

        // Remove old segments
        await this.prisma.customerSegment.deleteMany({
            where: { customerId },
        });

        // Add new segments
        for (const segmentType of segments) {
            await this.prisma.customerSegment.create({
                data: {
                    customerId,
                    segmentType,
                },
            });
        }

        return {
            message: 'Customer segments updated',
            segments,
        };
    }

    // Get customer's current segments
    async getCustomerSegments(customerId: string) {
        return this.prisma.customerSegment.findMany({
            where: { customerId },
            orderBy: {
                assignedAt: 'desc',
            },
        });
    }
}
