import {
    Controller,
    Post,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import { parse } from 'csv-parse/sync';

interface CsvMapping {
    title?: string;
    description?: string;
    price?: string;
    stock?: string;
    images?: string;
    category?: string;
    sku?: string;
}

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
export class AdminProductsImportController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('import/parse')
    @UseInterceptors(FileInterceptor('file'))
    async parseCSV(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const csvContent = file.buffer.toString('utf-8');
            const records = parse(csvContent, {
                columns: true,
                skip_empty_lines: true,
                bom: true,
            });

            // Récupérer les colonnes disponibles
            const columns = records.length > 0 ? Object.keys(records[0]) : [];

            // Auto-détection du mapping
            const suggestedMapping: CsvMapping = {};

            columns.forEach((col) => {
                const lower = col.toLowerCase();
                if (lower.includes('nom') || lower.includes('title') || lower.includes('name')) {
                    suggestedMapping.title = col;
                } else if (lower.includes('description') || lower.includes('desc')) {
                    suggestedMapping.description = col;
                } else if (lower.includes('prix') || lower.includes('price') || lower.includes('tarif')) {
                    suggestedMapping.price = col;
                } else if (lower.includes('stock') || lower.includes('quantity')) {
                    suggestedMapping.stock = col;
                } else if (lower.includes('image')) {
                    suggestedMapping.images = col;
                } else if (lower.includes('cat') || lower.includes('category')) {
                    suggestedMapping.category = col;
                } else if (lower.includes('sku') || lower.includes('ugs')) {
                    suggestedMapping.sku = col;
                }
            });

            return {
                totalRows: records.length,
                columns,
                suggestedMapping,
                preview: records.slice(0, 5),
            };
        } catch (error) {
            throw new BadRequestException(`Failed to parse CSV: ${error.message}`);
        }
    }

    @Post('import/preview')
    async previewImport(@Body() body: { records: any[]; mapping: CsvMapping }) {
        const { records, mapping } = body;

        const preview = records.slice(0, 5).map((record) => {
            const priceKey = mapping.price;
            const titleKey = mapping.title;
            const descKey = mapping.description;
            const stockKey = mapping.stock;
            const imagesKey = mapping.images;
            const categoryKey = mapping.category;
            const skuKey = mapping.sku;

            const price = priceKey ? this.parsePrice(record[priceKey]) : 0;
            const images = (imagesKey && record[imagesKey])
                ? record[imagesKey].split(',').map((url: string) => url.trim())
                : [];

            return {
                title: (titleKey && record[titleKey]) || 'Sans titre',
                description: (descKey && record[descKey]) || '',
                price,
                priceDisplay: `${(price / 100).toFixed(2)}€`,
                stock: stockKey ? (parseInt(record[stockKey]) || 0) : 0,
                images: images.slice(0, 1),
                category: (categoryKey && record[categoryKey]) || '',
                sku: (skuKey && record[skuKey]) || '',
            };
        });

        return {
            preview,
            totalToImport: records.length,
        };
    }

    @Post('import/execute')
    async executeImport(@Body() body: { records: any[]; mapping: CsvMapping }) {
        const { records, mapping } = body;

        let imported = 0;
        let errors = 0;
        const errorDetails: any[] = [];

        for (const record of records) {
            try {
                const priceKey = mapping.price;
                const titleKey = mapping.title;
                const descKey = mapping.description;
                const stockKey = mapping.stock;
                const imagesKey = mapping.images;
                const categoryKey = mapping.category;
                const skuKey = mapping.sku;

                const price = priceKey ? this.parsePrice(record[priceKey]) : 0;
                const images = (imagesKey && record[imagesKey])
                    ? record[imagesKey].split(',').map((url: string) => url.trim())
                    : [];

                const categoryName = (categoryKey && record[categoryKey]) || '';
                let collectionId: string | undefined = undefined;

                // Créer ou récupérer la collection
                if (categoryName) {
                    const collection = await this.productsService.findOrCreateCollection(
                        categoryName,
                    );
                    collectionId = collection.id;
                }

                // Créer le produit
                await this.productsService.create({
                    title: (titleKey && record[titleKey]) || 'Produit sans nom',
                    description: (descKey && record[descKey]) || '',
                    sku: (skuKey && record[skuKey]) || `SKU-${Date.now()}-${imported}`,
                    price,
                    stock: stockKey ? (parseInt(record[stockKey]) || 0) : 0,
                    images,
                    tags: [],
                    published: true,
                    collectionId,
                });

                imported++;
            } catch (error) {
                errors++;
                errorDetails.push({
                    row: imported + errors,
                    error: error.message,
                    data: record,
                });
            }
        }

        return {
            imported,
            errors,
            errorDetails: errorDetails.slice(0, 10), // Limiter à 10 erreurs
        };
    }

    private parsePrice(priceStr: string): number {
        if (!priceStr) return 0;
        const cleaned = priceStr.toString().replace(',', '.');
        const euros = parseFloat(cleaned);
        return Math.round(euros * 100);
    }

    private createSlug(title: string, index: number): string {
        return (
            title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') +
            '-' +
            Date.now() +
            '-' +
            index
        );
    }
}
