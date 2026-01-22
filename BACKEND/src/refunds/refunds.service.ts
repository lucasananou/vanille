import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRefundDto, ProcessRefundDto } from './dto/refund.dto';

@Injectable()
export class RefundsService {
    constructor(private prisma: PrismaService) { }

    async requestRefund(orderId: string, customerId: string, createDto: CreateRefundDto) {
        // Verify order exists and belongs to customer
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                refunds: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.customerId !== customerId) {
            throw new ForbiddenException('This order does not belong to you');
        }

        // Check if order can be refunded (must be PAID or SHIPPED)
        if (order.status !== 'PAID' && order.status !== 'SHIPPED') {
            throw new BadRequestException('Only paid or shipped orders can be refunded');
        }

        // Calculate total already refunded
        const totalRefunded = order.refunds
            .filter(r => r.status === 'APPROVED' || r.status === 'PROCESSED')
            .reduce((sum, r) => sum + r.amount, 0);

        // Check if refund amount is valid
        if (createDto.amount > order.total - totalRefunded) {
            throw new BadRequestException('Refund amount exceeds remaining order value');
        }

        return this.prisma.refund.create({
            data: {
                orderId,
                amount: createDto.amount,
                reason: createDto.reason,
            },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                    },
                },
            },
        });
    }

    async getRefunds(status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED', page = 1, limit = 20) {
        const where: any = {};
        if (status) {
            where.status = status;
        }

        const skip = (page - 1) * limit;

        const [refunds, total] = await Promise.all([
            this.prisma.refund.findMany({
                where,
                skip,
                take: limit,
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            email: true,
                            total: true,
                            customer: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.refund.count({ where }),
        ]);

        return {
            refunds,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getRefund(id: string) {
        const refund = await this.prisma.refund.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        items: true,
                        customer: true,
                    },
                },
            },
        });

        if (!refund) {
            throw new NotFoundException('Refund not found');
        }

        return refund;
    }

    async processRefund(id: string, adminId: string, processDto: ProcessRefundDto) {
        const refund = await this.getRefund(id);

        if (refund.status !== 'PENDING') {
            throw new BadRequestException('Only pending refunds can be processed');
        }

        const newStatus = processDto.status === 'APPROVED' ? 'PROCESSED' : 'REJECTED';

        return this.prisma.refund.update({
            where: { id },
            data: {
                status: newStatus,
                processedBy: adminId,
                processedAt: new Date(),
                notes: processDto.notes,
            },
        });
    }

    async getCustomerRefunds(customerId: string) {
        return this.prisma.refund.findMany({
            where: {
                order: {
                    customerId,
                },
            },
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async deleteRefund(id: string) {
        const refund = await this.getRefund(id);

        // Only allow deletion of REJECTED refunds
        if (refund.status !== 'REJECTED') {
            throw new BadRequestException('Only rejected refunds can be deleted');
        }

        await this.prisma.refund.delete({
            where: { id },
        });

        return { message: 'Refund deleted successfully' };
    }
}
