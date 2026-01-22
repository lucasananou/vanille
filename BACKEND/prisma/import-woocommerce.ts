import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface WooProduct {
    ID: string;
    Type: string;
    Nom: string;
    'Description courte': string;
    Description: string;
    'Tarif promo': string;
    'Tarif régulier': string;
    Catégories: string;
    Images: string;
    Stock: string;
    UGS: string;
    Parent: string;
    'Nom de l\'attribut 1': string;
    'Valeur(s) de l\'attribut 1 ': string;
}

// Télécharger une image depuis une URL
async function downloadImage(url: string, productId: string, index: number): Promise<string | null> {
    if (!url || url.trim() === '') return null;

    try {
        const cleanUrl = url.trim();
        const ext = path.extname(new URL(cleanUrl).pathname) || '.webp';
        const filename = `product-${productId}-${index}${ext}`;
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'products');

        // Créer le dossier si nécessaire
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);

        // Télécharger l'image
        await new Promise<void>((resolve, reject) => {
            const client = cleanUrl.startsWith('https') ? https : http;
            const file = fs.createWriteStream(filepath);

            client.get(cleanUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        });

        return `/uploads/products/${filename}`;
    } catch (error) {
        console.error(`Erreur téléchargement image ${url}:`, error);
        return null;
    }
}

// Créer un slug depuis le titre
function createSlug(title: string, id: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + id;
}

// Convertir prix en centimes
function priceToCents(price: string): number {
    if (!price || price === '') return 0;
    const cleaned = price.replace(',', '.');
    const euros = parseFloat(cleaned);
    return Math.round(euros * 100);
}

async function importProducts() {
    console.log('🚀 Démarrage de l\'import des produits WooCommerce...\n');

    // Lire le CSV
    const csvPath = path.join(__dirname, '..', '..', 'wc-product-export-17-1-2026-1768637589508.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records: WooProduct[] = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
    });

    console.log(`📦 ${records.length} lignes trouvées dans le CSV`);

    // Séparer produits variables et variations
    const variableProducts = records.filter(r => r.Type === 'variable');
    const variations = records.filter(r => r.Type === 'variation');

    console.log(`✅ ${variableProducts.length} produits principaux`);
    console.log(`✅ ${variations.length} variations\n`);

    // Créer les collections uniques
    const categoriesSet = new Set<string>();
    variableProducts.forEach(p => {
        if (p.Catégories) {
            p.Catégories.split(',').forEach(cat => categoriesSet.add(cat.trim()));
        }
    });

    console.log(`📂 Création de ${categoriesSet.size} collections...`);
    const collectionsMap = new Map<string, string>();

    for (const categoryName of Array.from(categoriesSet)) {
        const slug = createSlug(categoryName, '');
        const collection = await prisma.collection.upsert({
            where: { slug },
            create: {
                name: categoryName,
                slug,
                published: true,
            },
            update: {},
        });
        collectionsMap.set(categoryName, collection.id);
        console.log(`  ✓ ${categoryName}`);
    }

    console.log(`\n📦 Import des produits...`);
    let imported = 0;

    for (const product of variableProducts) {
        try {
            const productId = product.ID;
            const slug = createSlug(product.Nom, productId);

            // Prix du produit (on prendra le prix régulier du produit variable)
            const regularPrice = priceToCents(product['Tarif régulier']);
            const salePrice = priceToCents(product['Tarif promo']);
            const price = salePrice > 0 ? salePrice : regularPrice;

            // Télécharger les images
            const imageUrls = product.Images ? product.Images.split(',').map(u => u.trim()) : [];
            const images: string[] = [];

            for (let i = 0; i < Math.min(imageUrls.length, 5); i++) {
                const imagePath = await downloadImage(imageUrls[i], productId, i);
                if (imagePath) images.push(imagePath);
            }

            // Trouver la collection
            const categoryName = product.Catégories ? product.Catégories.split(',')[0].trim() : '';
            const collectionId = collectionsMap.get(categoryName);

            // Créer le produit
            const createdProduct = await prisma.product.create({
                data: {
                    title: product.Nom,
                    description: product.Description || product['Description courte'] || '',
                    sku: product.UGS || `SKU-${productId}`,
                    slug,
                    price,
                    compareAtPrice: regularPrice > price ? regularPrice : null,
                    stock: 0, // On mettra à jour avec les variations
                    images,
                    tags: [],
                    published: true,
                    collectionId,
                },
            });

            // Trouver les variations de ce produit
            const productVariations = variations.filter(v => v.Parent === productId);

            // Créer les options (ex: Taille)
            if (productVariations.length > 0 && product['Nom de l\'attribut 1']) {
                const optionName = product['Nom de l\'attribut 1'];
                const optionValues = product['Valeur(s) de l\'attribut 1 ']
                    ? product['Valeur(s) de l\'attribut 1 '].split(',').map(v => v.trim())
                    : [];

                if (optionValues.length > 0) {
                    await prisma.productOption.create({
                        data: {
                            productId: createdProduct.id,
                            name: optionName,
                            values: optionValues,
                            position: 0,
                        },
                    });
                }
            }

            // Créer les variations
            let totalStock = 0;
            for (const variation of productVariations) {
                const variantPrice = priceToCents(variation['Tarif promo']) || priceToCents(variation['Tarif régulier']) || price;
                const variantStock = parseInt(variation.Stock) || 0;
                totalStock += variantStock;

                const variantTitle = variation.Nom.replace(product.Nom, '').trim().replace(/^-\s*/, '');
                const optionValue = variation['Valeur(s) de l\'attribut 1 '] || '';

                await prisma.productVariant.create({
                    data: {
                        productId: createdProduct.id,
                        sku: variation.UGS || `${product.UGS}-${optionValue}`,
                        title: variantTitle || optionValue,
                        price: variantPrice,
                        stock: variantStock,
                        options: { [product['Nom de l\'attribut 1'] || 'Taille']: optionValue },
                        published: true,
                    },
                });
            }

            // Mettre à jour le stock total du produit
            await prisma.product.update({
                where: { id: createdProduct.id },
                data: { stock: totalStock },
            });

            imported++;
            console.log(`  ✓ [${imported}/${variableProducts.length}] ${product.Nom} (${productVariations.length} variations, stock: ${totalStock})`);

        } catch (error) {
            console.error(`  ✗ Erreur import ${product.Nom}:`, error);
        }
    }

    console.log(`\n✅ Import terminé: ${imported} produits importés!`);
}

// Lancer l'import
importProducts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
