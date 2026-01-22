import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateProductOptionDto,
    UpdateProductOptionDto,
    CreateVariantDto,
    UpdateVariantDto,
} from './dto/variant.dto';

@Injectable()
export class VariantsService {
    constructor(private prisma: PrismaService) { }

    // PRODUCT OPTIONS
    async getProductOptions(productId: string) {
        return this.prisma.productOption.findMany({
            where: { productId },
            orderBy: { position: 'asc' },
        });
    }

    async createProductOption(productId: string, createDto: CreateProductOptionDto) {
        // Verify product exists
        await this.prisma.product.findUniqueOrThrow({
            where: { id: productId },
        });

        return this.prisma.productOption.create({
            data: {
                ...createDto,
                productId,
            },
        });
    }

    async updateProductOption(productId: string, optionId: string, updateDto: UpdateProductOptionDto) {
        const option = await this.prisma.productOption.findFirst({
            where: { id: optionId, productId },
        });

        if (!option) {
            throw new NotFoundException('Product option not found');
        }

        return this.prisma.productOption.update({
            where: { id: optionId },
            data: updateDto,
        });
    }

    async deleteProductOption(productId: string, optionId: string) {
        const option = await this.prisma.productOption.findFirst({
            where: { id: optionId, productId },
        });

        if (!option) {
            throw new NotFoundException('Product option not found');
        }

        await this.prisma.productOption.delete({
            where: { id: optionId },
        });

        return { message: 'Product option deleted successfully' };
    }

    // PRODUCT VARIANTS
    async getProductVariants(productId: string) {
        return this.prisma.productVariant.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getVariant(productId: string, variantId: string) {
        const variant = await this.prisma.productVariant.findFirst({
            where: { id: variantId, productId },
        });

        if (!variant) {
            throw new NotFoundException('Variant not found');
        }

        return variant;
    }

    async createVariant(productId: string, createDto: CreateVariantDto) {
        // Verify product exists
        await this.prisma.product.findUniqueOrThrow({
            where: { id: productId },
        });

        // Check SKU uniqueness
        const existingSku = await this.prisma.productVariant.findUnique({
            where: { sku: createDto.sku },
        });

        if (existingSku) {
            throw new BadRequestException('SKU already exists');
        }

        return this.prisma.productVariant.create({
            data: {
                ...createDto,
                productId,
            },
        });
    }

    async updateVariant(productId: string, variantId: string, updateDto: UpdateVariantDto) {
        await this.getVariant(productId, variantId);

        return this.prisma.productVariant.update({
            where: { id: variantId },
            data: updateDto,
        });
    }

    async deleteVariant(productId: string, variantId: string) {
        await this.getVariant(productId, variantId);

        await this.prisma.productVariant.delete({
            where: { id: variantId },
        });

        return { message: 'Variant deleted successfully' };
    }

    async generateVariants(productId: string, clearExisting = false) {
        // Get product with options
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                options: {
                    orderBy: { position: 'asc' },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.options.length === 0) {
            throw new BadRequestException('Product has no options defined. Create options first.');
        }

        // Clear existing variants if requested
        if (clearExisting) {
            await this.prisma.productVariant.deleteMany({
                where: { productId },
            });
        }

        // Generate all combinations
        const combinations = this.generateCombinations(product.options);

        // Create variants
        const variants: any[] = [];
        for (const combination of combinations) {
            const title = Object.values(combination).join(' / ');
            const sku = `${product.sku}-${Object.values(combination).join('-').toUpperCase()}`;

            // Skip if SKU already exists
            const exists = await this.prisma.productVariant.findUnique({
                where: { sku },
            });

            if (!exists) {
                const variant = await this.prisma.productVariant.create({
                    data: {
                        productId,
                        sku,
                        title,
                        options: combination,
                        stock: 0,
                        published: true,
                    },
                });
                variants.push(variant);
            }
        }

        return {
            message: `Generated ${variants.length} variants`,
            variants,
        };
    }

    private generateCombinations(options: Array<{ name: string; values: string[] }>): Array<Record<string, string>> {
        if (options.length === 0) return [{}];

        const [first, ...rest] = options;
        const restCombinations = this.generateCombinations(rest);

        const combinations: any[] = [];
        for (const value of first.values) {
            for (const restCombination of restCombinations) {
                combinations.push({
                    [first.name]: value,
                    ...restCombination,
                });
            }
        }

        return combinations;
    }
}
