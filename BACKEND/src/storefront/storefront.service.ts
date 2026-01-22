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
    }) {
        console.log('[DEBUG] getProducts called with:', params);
        try {
            const {
                skip = 0,
                take = 24,
                collectionSlug,
                tags,
                minPrice,
                maxPrice,
                sortBy = 'newest',
            } = params;

            const where: any = {
                published: true,
            };

            // Filter by collection
            if (collectionSlug) {
                console.log('[DEBUG] Finding collection:', collectionSlug);
                const collection = await this.prisma.collection.findUnique({
                    where: { slug: collectionSlug },
                });
                if (collection) {
                    console.log('[DEBUG] Collection found:', collection.id);
                    where.collectionId = collection.id;
                } else {
                    console.warn('[DEBUG] Collection NOT found:', collectionSlug);
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

            console.log('[DEBUG] Executing Prisma Query with where:', JSON.stringify(where));

            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    skip,
                    take,
                    orderBy,
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        price: true,
                        compareAtPrice: true,
                        images: true,
                        tags: true,
                        seoTitle: true,
                        seoMetaDescription: true,
                        options: {
                            select: {
                                id: true,
                                name: true,
                                values: true,
                            },
                        },
                        variants: {
                            select: {
                                id: true,
                                price: true,
                                compareAtPrice: true,
                            },
                        },
                        collection: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                }),
                this.prisma.product.count({ where }),
            ]);

            console.log(`[DEBUG] Found ${products.length} products, total: ${total}`);

            return {
                data: products,
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
        console.log(`[DEBUG] StorefrontService: Fetching product by slug: "${decodedSlug}"`);

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
            },
        });

        if (!product) {
            throw new NotFoundException(`Product not found`);
        }

        return product;
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
