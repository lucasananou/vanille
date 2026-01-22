import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateShippingZoneDto,
    UpdateShippingZoneDto,
    CreateShippingRateDto,
    UpdateShippingRateDto,
} from './dto/shipping.dto';

@Injectable()
export class ShippingService {
    constructor(private prisma: PrismaService) { }

    // ZONES
    async createZone(createDto: CreateShippingZoneDto) {
        return this.prisma.shippingZone.create({
            data: {
                ...createDto,
                regions: createDto.regions || [],
            },
        });
    }

    async getZones() {
        return this.prisma.shippingZone.findMany({
            include: {
                rates: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getZone(id: string) {
        const zone = await this.prisma.shippingZone.findUnique({
            where: { id },
            include: {
                rates: true,
            },
        });

        if (!zone) {
            throw new NotFoundException('Shipping zone not found');
        }

        return zone;
    }

    async updateZone(id: string, updateDto: UpdateShippingZoneDto) {
        await this.getZone(id);

        return this.prisma.shippingZone.update({
            where: { id },
            data: updateDto,
        });
    }

    async deleteZone(id: string) {
        await this.getZone(id);

        await this.prisma.shippingZone.delete({
            where: { id },
        });

        return { message: 'Shipping zone deleted successfully' };
    }

    // RATES
    async createRate(zoneId: string, createDto: CreateShippingRateDto) {
        await this.getZone(zoneId);

        return this.prisma.shippingRate.create({
            data: {
                ...createDto,
                zoneId,
            },
            include: {
                zone: true,
            },
        });
    }

    async getRate(rateId: string) {
        const rate = await this.prisma.shippingRate.findUnique({
            where: { id: rateId },
            include: {
                zone: true,
            },
        });

        if (!rate) {
            throw new NotFoundException('Shipping rate not found');
        }

        return rate;
    }

    async updateRate(rateId: string, updateDto: UpdateShippingRateDto) {
        await this.getRate(rateId);

        return this.prisma.shippingRate.update({
            where: { id: rateId },
            data: updateDto,
        });
    }

    async deleteRate(rateId: string) {
        await this.getRate(rateId);

        await this.prisma.shippingRate.delete({
            where: { id: rateId },
        });

        return { message: 'Shipping rate deleted successfully' };
    }

    // CALCULATE AVAILABLE RATES
    async calculateAvailableRates(country: string, region: string | undefined, orderValue: number) {
        // Find zones that match the country/region
        const zones = await this.prisma.shippingZone.findMany({
            where: {
                active: true,
                OR: [
                    { countries: { has: country } },
                    ...(region ? [{ regions: { has: region } }] : []),
                ],
            },
            include: {
                rates: {
                    where: {
                        active: true,
                    },
                },
            },
        });

        if (zones.length === 0) {
            return { availableRates: [], message: 'No shipping available for this location' };
        }

        // Collect all applicable rates
        const applicableRates: any[] = [];

        for (const zone of zones) {
            for (const rate of zone.rates) {
                // Check order value constraints
                if (rate.minOrderValue && orderValue < rate.minOrderValue) {
                    continue;
                }
                if (rate.maxOrderValue && orderValue > rate.maxOrderValue) {
                    continue;
                }

                applicableRates.push({
                    id: rate.id,
                    name: rate.name,
                    price: rate.price,
                    estimatedDays: rate.estimatedDays,
                    zoneName: zone.name,
                });
            }
        }

        if (applicableRates.length === 0) {
            return { availableRates: [], message: 'No shipping rates match order criteria' };
        }

        // Sort by price (cheapest first)
        applicableRates.sort((a, b) => a.price - b.price);

        return { availableRates: applicableRates };
    }

    async estimateShipping(country: string, region?: string) {
        const zones = await this.prisma.shippingZone.findMany({
            where: {
                active: true,
                OR: [
                    { countries: { has: country } },
                    ...(region ? [{ regions: { has: region } }] : []),
                ],
            },
            include: {
                rates: {
                    where: { active: true },
                    orderBy: { price: 'asc' },
                    take: 1,
                },
            },
        });

        if (zones.length === 0 || zones[0].rates.length === 0) {
            return null;
        }

        const cheapestRate = zones[0].rates[0];
        return {
            estimatedCost: cheapestRate.price,
            estimatedDays: cheapestRate.estimatedDays,
        };
    }
}
