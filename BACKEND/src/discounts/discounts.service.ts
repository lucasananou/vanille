import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountsService {
    constructor(private prisma: PrismaService) { }

    async createDiscount(createDto: CreateDiscountDto) {
        // Check if code already exists
        const existing = await this.prisma.discountCode.findUnique({
            where: { code: createDto.code },
        });

        if (existing) {
            throw new BadRequestException('Discount code already exists');
        }

        // Validate percentage value
        if (createDto.type === 'PERCENTAGE' && createDto.value > 100) {
            throw new BadRequestException('Percentage value cannot exceed 100');
        }

        return this.prisma.discountCode.create({
            data: {
                ...createDto,
                startsAt: createDto.startsAt ? new Date(createDto.startsAt) : null,
                endsAt: createDto.endsAt ? new Date(createDto.endsAt) : null,
            },
        });
    }

    async getDiscounts(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [discounts, total] = await Promise.all([
            this.prisma.discountCode.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.discountCode.count(),
        ]);

        return {
            discounts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getDiscount(id: string) {
        const discount = await this.prisma.discountCode.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { orders: true },
                },
            },
        });

        if (!discount) {
            throw new NotFoundException('Discount code not found');
        }

        return discount;
    }

    async updateDiscount(id: string, updateDto: UpdateDiscountDto) {
        const discount = await this.prisma.discountCode.findUnique({ where: { id } });

        if (!discount) {
            throw new NotFoundException('Discount code not found');
        }

        // Validate percentage value if updating
        if (updateDto.value !== undefined && discount.type === 'PERCENTAGE' && updateDto.value > 100) {
            throw new BadRequestException('Percentage value cannot exceed 100');
        }

        return this.prisma.discountCode.update({
            where: { id },
            data: {
                ...updateDto,
                startsAt: updateDto.startsAt ? new Date(updateDto.startsAt) : undefined,
                endsAt: updateDto.endsAt ? new Date(updateDto.endsAt) : undefined,
            },
        });
    }

    async deleteDiscount(id: string) {
        await this.getDiscount(id);

        await this.prisma.discountCode.delete({
            where: { id },
        });

        return { message: 'Discount code deleted successfully' };
    }

    async validateDiscount(
        code: string,
        subtotal: number,
        productIds: string[] = [],
        collectionIds: string[] = [],
        customerId?: string,
    ) {
        const discount = await this.prisma.discountCode.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!discount) {
            throw new BadRequestException('Invalid discount code');
        }

        if (!discount.active) {
            throw new BadRequestException('This discount code is not active');
        }

        // Check date validity
        const now = new Date();
        if (discount.startsAt && now < discount.startsAt) {
            throw new BadRequestException('This discount code is not yet valid');
        }

        if (discount.endsAt && now > discount.endsAt) {
            throw new BadRequestException('This discount code has expired');
        }

        // Check usage limits
        if (discount.maxUses && discount.usedCount >= discount.maxUses) {
            throw new BadRequestException('This discount code has reached its usage limit');
        }

        // Check per-user usage limit
        if (customerId && discount.maxUsesPerUser) {
            const userUsageCount = await this.prisma.order.count({
                where: {
                    customerId,
                    discountCodeId: discount.id,
                },
            });

            if (userUsageCount >= discount.maxUsesPerUser) {
                throw new BadRequestException('You have already used this discount code the maximum number of times');
            }
        }

        // Check minimum purchase
        if (discount.minPurchase && subtotal < discount.minPurchase) {
            const minFormatted = (discount.minPurchase / 100).toFixed(2);
            throw new BadRequestException(`Minimum purchase of $${minFormatted} required`);
        }

        // Check product/collection restrictions
        if (discount.appliesToProducts.length > 0) {
            const hasApplicableProduct = productIds.some(id => discount.appliesToProducts.includes(id));
            if (!hasApplicableProduct) {
                throw new BadRequestException('This discount does not apply to items in your cart');
            }
        }

        if (discount.appliesToCollections.length > 0) {
            const hasApplicableCollection = collectionIds.some(id => discount.appliesToCollections.includes(id));
            if (!hasApplicableCollection) {
                throw new BadRequestException('This discount does not apply to items in your cart');
            }
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (discount.type === 'PERCENTAGE') {
            discountAmount = Math.round((subtotal * discount.value) / 100);
        } else if (discount.type === 'FIXED_AMOUNT') {
            discountAmount = Math.min(discount.value, subtotal);
        }
        // FREE_SHIPPING is handled separately in shipping calculation

        return {
            valid: true,
            discount,
            discountAmount,
        };
    }

    async incrementUsage(discountCodeId: string) {
        return this.prisma.discountCode.update({
            where: { id: discountCodeId },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
    }

    async getDiscountByCode(code: string) {
        const discount = await this.prisma.discountCode.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!discount) {
            throw new NotFoundException('Discount code not found');
        }

        return discount;
    }
}
