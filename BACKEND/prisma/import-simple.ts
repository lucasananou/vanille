import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

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
    console.log('🚀 Démarrage import simplifié...\n');

    try {
        // Lire le CSV
        const csvPath = path.join(__dirname, '..', '..', 'wc-product-export-17-1-2026-1768637589508.csv');
        console.log(`📄 Lecture du fichier: ${csvPath}`);

        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            bom: true,
        });

        console.log(`✅ ${records.length} lignes lues\n`);

        // Séparer produits variables et variations
        const variableProducts = records.filter((r: any) => r.Type === 'variable');
        const variations = records.filter((r: any) => r.Type === 'variation');

        console.log(`📦 ${variableProducts.length} produits principaux`);
        console.log(`🔄 ${variations.length} variations\n`);

        // Créer les collections
        const categoriesSet = new Set<string>();
        variableProducts.forEach((p: any) => {
            if (p.Catégories) {
                p.Catégories.split(',').forEach((cat: string) => categoriesSet.add(cat.trim()));
            }
        });

        console.log(`📂 Création de ${categoriesSet.size} collections...`);
        const collectionsMap = new Map<string, string>();

        for (const categoryName of Array.from(categoriesSet)) {
            try {
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
            } catch (error) {
                console.error(`  ✗ Erreur collection ${categoryName}:`, error);
            }
        }

        console.log(`\n📦 Import des produits (sans images)...`);
        let imported = 0;
        let errors = 0;

        for (let i = 0; i < Math.min(variableProducts.length, 5); i++) {
            const product = variableProducts[i];

            try {
                const productId = product.ID;
                const slug = createSlug(product.Nom, productId);

                console.log(`\n[${i + 1}] ${product.Nom}`);
                console.log(`  → ID: ${productId}, Slug: ${slug}`);

                // Prix
                const regularPrice = priceToCents(product['Tarif régulier']);
                const salePrice = priceToCents(product['Tarif promo']);
                const price = salePrice > 0 ? salePrice : regularPrice;
                console.log(`  → Prix: ${price} centimes (${price / 100}€)`);

                // Collection
                const categoryName = product.Catégories ? product.Catégories.split(',')[0].trim() : '';
                const collectionId = collectionsMap.get(categoryName);
                console.log(`  → Catégorie: ${categoryName} → ${collectionId || 'AUCUNE'}`);

                // Images (garder les URLs sans télécharger)
                const imageUrls = product.Images ? product.Images.split(',').map((u: string) => u.trim()) : [];
                console.log(`  → Images: ${imageUrls.length} URLs trouvées`);

                // Créer le produit
                const createdProduct = await prisma.product.create({
                    data: {
                        title: product.Nom,
                        description: product.Description || product['Description courte'] || '',
                        sku: product.UGS || `SKU-${productId}`,
                        slug,
                        price,
                        compareAtPrice: regularPrice > price ? regularPrice : null,
                        stock: 0,
                        images: imageUrls.slice(0, 3), // Garder juste les URLs
                        tags: [],
                        published: true,
                        collectionId,
                    },
                });

                console.log(`  ✅ PRODUIT CRÉÉ: ${createdProduct.id}`);
                imported++;

            } catch (error: any) {
                console.error(`  ❌ ERREUR:`, error.message);
                errors++;
            }
        }

        console.log(`\n✅ Import terminé!`);
        console.log(`   Importés: ${imported}`);
        console.log(`   Erreurs: ${errors}`);

    } catch (error) {
        console.error('❌ Erreur fatale:', error);
    }
}

importProducts()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
