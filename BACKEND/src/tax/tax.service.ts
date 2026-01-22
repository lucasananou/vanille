import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxRateDto, UpdateTaxRateDto } from './dto/tax.dto';

@Injectable()
export class TaxService {
    constructor(private prisma: PrismaService) { }

    async createRate(createDto: CreateTaxRateDto) {
        // Check if rate already exists for this country/region
        const exists = await this.prisma.taxRate.findFirst({
            where: {
                country: createDto.country,
                ...(createDto.region ? { region: createDto.region } : { region: null }),
            },
        });

        if (exists) {
            throw new BadRequestException('Tax rate already exists for this country/region');
        }

        return this.prisma.taxRate.create({
            data: createDto,
        });
    }

    async getRates() {
        return this.prisma.taxRate.findMany({
            orderBy: [
                { country: 'asc' },
                { region: 'asc' },
            ],
        });
    }

    async getRate(id: string) {
        const rate = await this.prisma.taxRate.findUnique({
            where: { id },
        });

        if (!rate) {
            throw new NotFoundException('Tax rate not found');
        }

        return rate;
    }

    async updateRate(id: string, updateDto: UpdateTaxRateDto) {
        await this.getRate(id);

        return this.prisma.taxRate.update({
            where: { id },
            data: updateDto,
        });
    }

    async deleteRate(id: string) {
        await this.getRate(id);

        await this.prisma.taxRate.delete({
            where: { id },
        });

        return { message: 'Tax rate deleted successfully' };
    }

    async calculateTax(country: string, region: string | undefined, subtotal: number) {
        // Try to find specific region rate first
        let taxRate: any = null;

        if (region) {
            taxRate = await this.prisma.taxRate.findFirst({
                where: {
                    country,
                    region,
                    active: true,
                },
            });
        }

        // Fallback to country-level rate
        if (!taxRate) {
            taxRate = await this.prisma.taxRate.findFirst({
                where: {
                    country,
                    region: null,
                    active: true,
                },
            });
        }

        if (!taxRate) {
            return {
                applicable: false,
                taxAmount: 0,
                taxRate: 0,
                taxName: 'No tax',
            };
        }

        const taxAmount = Math.round(subtotal * taxRate.rate);

        return {
            applicable: true,
            taxAmount,
            taxRate: taxRate.rate,
            taxName: taxRate.name,
        };
    }

    async getTaxForLocation(country: string, region?: string): Promise<any> {
        let taxRate: any = null;

        if (region) {
            taxRate = await this.prisma.taxRate.findFirst({
                where: {
                    country,
                    region,
                    active: true,
                },
            });
        }

        if (!taxRate) {
            taxRate = await this.prisma.taxRate.findFirst({
                where: {
                    country,
                    region: null,
                    active: true,
                },
            });
        }

        return taxRate;
    }
}
