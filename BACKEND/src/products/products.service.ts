import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findOrCreateCollection(name: string) {
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return this.prisma.collection.upsert({
            where: { slug },
            create: { name, slug, published: true },
            update: {},
        });
    }

    private generateSlug(title: string): string {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    async create(createProductDto: CreateProductDto) {
        const slug = this.generateSlug(createProductDto.title);

        // Ensure slug is unique
        let uniqueSlug = slug;
        let counter = 1;
        while (await this.prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        const { options, variants, ...productData } = createProductDto;

        return this.prisma.product.create({
            data: {
                ...productData,
                slug: uniqueSlug,
                options: options ? {
                    create: options
                } : undefined,
                variants: variants ? {
                    create: variants
                } : undefined,
            },
            include: {
                collection: true,
                options: true,
                variants: true,
            },
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        published?: boolean;
        collectionId?: string;
        search?: string;
    }) {
        const { skip = 0, take = 50, published, collectionId, search } = params;

        const where: any = {};
        if (published !== undefined) {
            where.published = published;
        }
        if (collectionId) {
            where.collectionId = collectionId;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                include: {
                    collection: true,
                    options: true,
                    variants: true,
                    reviews: {
                        where: { status: 'APPROVED' },
                        select: { rating: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        const productsWithStats = products.map(product => {
            const reviews = (product as any).reviews || [];
            const reviewsCount = reviews.length;
            const averageRating = reviewsCount > 0
                ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount) * 10) / 10
                : 0;

            const { reviews: _, ...rest } = product as any;
            return {
                ...rest,
                reviewsCount,
                averageRating
            };
        });

        return {
            data: productsWithStats,
            pagination: {
                total,
                page: Math.floor(skip / take) + 1,
                limit: take,
                pages: Math.ceil(total / take),
            },
        };
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                collection: true,
                options: true,
                variants: true,
                reviews: {
                    where: { status: 'APPROVED' },
                    select: { rating: true }
                }
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const reviews = (product as any).reviews || [];
        const reviewsCount = reviews.length;
        const averageRating = reviewsCount > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount
            : 0;

        return {
            ...product,
            averageRating: Math.round(averageRating * 10) / 10,
            reviewsCount
        };
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                collection: true,
                options: true,
                variants: true,
                reviews: {
                    where: { status: 'APPROVED' },
                    select: { rating: true }
                }
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with slug ${slug} not found`);
        }

        const reviews = (product as any).reviews || [];
        const reviewsCount = reviews.length;
        const averageRating = reviewsCount > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsCount
            : 0;

        return {
            ...product,
            averageRating: Math.round(averageRating * 10) / 10,
            reviewsCount
        };
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Check if product exists
        const existing = await this.findOne(id);

        const { options, variants, ...dtoData } = updateProductDto;

        // Start with a clean data object
        const productData: any = { ...dtoData };

        // Handle slug regeneration if title changes and no slug is provided, 
        // or if a new slug is explicitly provided
        if (dtoData.title && (!dtoData.slug || dtoData.slug === existing.slug)) {
            const baseSlug = this.generateSlug(dtoData.title);
            if (baseSlug !== existing.slug) {
                let uniqueSlug = baseSlug;
                let counter = 1;
                while (await this.prisma.product.findFirst({
                    where: {
                        slug: uniqueSlug,
                        id: { not: id }
                    }
                })) {
                    uniqueSlug = `${baseSlug}-${counter}`;
                    counter++;
                }
                productData.slug = uniqueSlug;
            }
        }

        // Transaction to ensure all or nothing
        return this.prisma.$transaction(async (tx) => {
            // Update options if provided
            if (options) {
                await tx.productOption.deleteMany({ where: { productId: id } });
                await tx.productOption.createMany({
                    data: options.map(opt => ({
                        name: opt.name,
                        values: opt.values,
                        position: opt.position || 0,
                        productId: id
                    }))
                });
            }

            // Update variants if provided
            if (variants) {
                // Delete existing variants
                await tx.productVariant.deleteMany({ where: { productId: id } });
                // Create new variants
                // Note: We map explicitly to avoid any extra fields (like id) from the frontend
                await tx.productVariant.createMany({
                    data: variants.map(v => ({
                        title: v.title,
                        sku: v.sku,
                        price: v.price,
                        compareAtPrice: v.compareAtPrice,
                        stock: v.stock || 0,
                        image: v.image,
                        options: v.options || {},
                        productId: id
                    }))
                });
            }

            return tx.product.update({
                where: { id },
                data: productData,
                include: {
                    collection: true,
                    options: true,
                    variants: true,
                },
            });
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.product.delete({
            where: { id },
        });
    }

    async decrementStock(productId: string, quantity: number) {
        const product = await this.findOne(productId);

        if (product.stock < quantity) {
            throw new Error(`Insufficient stock for product ${product.title}`);
        }

        return this.prisma.product.update({
            where: { id: productId },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });
    }
    async removeMany(ids: string[]) {
        return this.prisma.product.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }
}
