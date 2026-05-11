import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorefrontService {
    constructor(private prisma: PrismaService) { }

    async getProducts(params: {
        skip?: number;
        take?: number;
        collectionSlug?: string;
        tags?: string[];
        minPrice?: number;
        maxPrice?: number;
        sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'title';
        search?: string;
    }) {
        try {
            const {
                skip = 0,
                take = 24,
                collectionSlug,
                tags,
                minPrice,
                maxPrice,
                sortBy = 'newest',
                search,
            } = params;

            const where: any = {
                published: true,
            };

            // Filter by collection
            if (collectionSlug) {
                const collection = await this.prisma.collection.findUnique({
                    where: { slug: collectionSlug },
                });
                if (collection) {
                    where.collectionId = collection.id;
                }
            }

            // Filter by tags
            if (tags && tags.length > 0) {
                where.tags = {
                    hasSome: tags,
                };
            }

            // Filter by price range
            if (minPrice !== undefined || maxPrice !== undefined) {
                where.price = {};
                if (minPrice !== undefined) {
                    where.price.gte = minPrice;
                }
                if (maxPrice !== undefined) {
                    where.price.lte = maxPrice;
                }
            }

            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                    { tags: { has: search.toLowerCase() } },
                ];
            }

            // Sort options
            const orderBy: any = {};
            switch (sortBy) {
                case 'price_asc':
                    orderBy.price = 'asc';
                    break;
                case 'price_desc':
                    orderBy.price = 'desc';
                    break;
                case 'title':
                    orderBy.title = 'asc';
                    break;
                case 'newest':
                default:
                    orderBy.createdAt = 'desc';
                    break;
            }

            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        sku: true,
                        slug: true,
                        price: true,
                        compareAtPrice: true,
                        stock: true,
                        images: true,
                        tags: true,
                        published: true,
                        seoTitle: true,
                        seoMetaDescription: true,
                        details: true,
                        createdAt: true,
                        updatedAt: true,
                        options: {
                            select: {
                                id: true,
                                productId: true,
                                name: true,
                                values: true,
                                position: true,
                            },
                        },
                        variants: {
                            select: {
                                id: true,
                                productId: true,
                                sku: true,
                                title: true,
                                price: true,
                                compareAtPrice: true,
                                stock: true,
                                image: true,
                                options: true,
                                createdAt: true,
                                updatedAt: true,
                            },
                        },
                        collection: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                        reviews: {
                            where: { status: 'APPROVED' },
                            select: { rating: true },
                        },
                    },
                }),
                this.prisma.product.count({ where }),
            ]);

            const productsWithStats = products.map((product) => {
                const reviews = product.reviews || [];
                const reviewsCount = reviews.length;
                const averageRating = reviewsCount > 0
                    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount) * 10) / 10
                    : 0;
                const { reviews: _reviews, ...rest } = product;

                return {
                    ...rest,
                    reviewsCount,
                    averageRating,
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
        } catch (error) {
            console.error('[ERROR] getProducts failed:', error);
            throw error;
        }
    }

    async getProductBySlug(slug: string) {
        const decodedSlug = decodeURIComponent(slug).trim();

        const product = await this.prisma.product.findFirst({
            where: { slug: decodedSlug, published: true },
            include: {
                options: true,
                variants: true,
                collection: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                reviews: {
                    where: { status: 'APPROVED' },
                    select: { rating: true },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Product not found`);
        }

        const reviews = product.reviews || [];
        const reviewsCount = reviews.length;
        const averageRating = reviewsCount > 0
            ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsCount) * 10) / 10
            : 0;
        const { reviews: _reviews, ...rest } = product;

        return {
            ...rest,
            reviewsCount,
            averageRating,
        };
    }

    async getCollections() {
        return this.prisma.collection.findMany({
            where: { published: true },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                _count: {
                    select: {
                        products: {
                            where: { published: true },
                        },
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async getCollectionBySlug(slug: string) {
        const collection = await this.prisma.collection.findUnique({
            where: { slug, published: true },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
            },
        });

        if (!collection) {
            throw new NotFoundException(`Collection not found`);
        }

        return collection;
    }

    async getCollectionProducts(slug: string, skip = 0, take = 24) {
        const collection = await this.getCollectionBySlug(slug);

        return this.getProducts({
            skip,
            take,
            collectionSlug: slug,
        });
    }
}
