import type { Product } from '@/lib/types';
import type { BlogPost } from '@/lib/data/blog-posts';
import type { Locale } from '@/lib/i18n';

const productTranslations: Record<string, { title?: string; subtitle?: string; description?: string; bullets?: string[] }> = {
  'poivre-sauvage': {
    title: 'Wild Madagascar Pepper',
    subtitle: 'The pure expression of Malagasy terroir',
    description:
      'Harvested in preserved regions of Madagascar, our wild pepper is hand-picked according to traditional expertise passed down through generations.\n\nEach berry reveals the richness of its origin: deep woody notes, a delicately spicy warmth and a long, refined finish. Rare and highly sought after, it appeals to chefs and gourmet enthusiasts looking for authenticity, character and distinction.',
    bullets: ['Hand-harvested in Madagascar', 'Woody notes and subtle warmth', 'Origin: Madagascar (Nosy-Be)'],
  },
  'pack-decouverte': {
    title: 'Discovery Set',
    subtitle: 'Explore several lengths in one curated selection',
    bullets: [
      '17–18 cm: 2 pods',
      '16 cm: 2 pods',
      '14–15 cm: 10 pods',
      '10–13 cm: 10 pods',
      '+ One surprise included',
    ],
  },
  'pack-pro': {
    title: 'Professional Pack',
    subtitle: 'Tailored volumes for chefs, pastry teams and retailers',
    bullets: ['Volumes tailored to professionals', 'Fast B2B quotation process', 'Vacuum-sealed packaging'],
  },
};

function normalizeProductKey(product: Product) {
  return (product.slug || product.id || '').toLowerCase();
}

function translateVanillaTitle(title: string) {
  return title
    .replace('Vanille', 'Madagascar Vanilla')
    .replace('Poivre Sauvage de Madagascar', 'Wild Madagascar Pepper')
    .replace('Pack Découverte', 'Discovery Set')
    .replace('Pack Pro', 'Professional Pack');
}

function translateGrade(grade: string) {
  return grade
    .replace('Noir', 'Black')
    .replace('Assorti', 'Assorted')
    .replace('Poivre Sauvage', 'Wild Pepper')
    .replace('Excellence Sauvage', 'Wild Excellence');
}

function buildVanillaEnglishDescription(product: Product) {
  const size = typeof (product.details as { size?: string } | undefined)?.size === 'string'
    ? (product.details as { size?: string }).size
    : '';
  const grade = typeof (product.details as { grade?: string } | undefined)?.grade === 'string'
    ? (product.details as { grade?: string }).grade
    : '';

  return [
    `Selected in Nosy-Be, Madagascar, this ${grade ? `${translateGrade(grade)} ` : ''}vanilla is designed for pastry work, infusions, homemade extract and refined gifting.${size ? ` Format: ${size}.` : ''}`,
    'Each pod is chosen for its aromatic depth, supple texture and elegant finish, with a premium presentation suited to both home gourmets and professional kitchens.',
  ].join('\n\n');
}

export function getLocalizedProduct(product: Product, locale: Locale) {
  if (locale === 'fr') return product;

  const key = normalizeProductKey(product);
  const custom = productTranslations[key] || {};

  return {
    ...product,
    title: custom.title || translateVanillaTitle(product.title),
    description: custom.description || buildVanillaEnglishDescription(product),
    bullets: custom.bullets || product.bullets?.map((bullet) =>
      bullet
        .replace('Vente uniquement par bottes (sous-vide)', 'Available in vacuum-sealed bundles only')
        .replace('Vente en tube ou par bottes (sous-vide)', 'Available in gift tubes or vacuum-sealed bundles')
        .replace('Longueur premium (présentation & intensité)', 'Premium length for visual impact and aromatic intensity')
        .replace('Parfait pour entremets, crèmes, glaces', 'Ideal for plated desserts, creams and ice cream')
        .replace('Gousses souples, parfum gourmand', 'Supple pods with a warm, gourmet aroma')
        .replace('Idéal pour desserts, infusion, cuisine', 'Ideal for desserts, infusions and fine cooking')
        .replace('Pour pâtissiers, chefs, cadeaux', 'Created for chefs, pastry artisans and refined gifting')
        .replace('Conditionnement sous‑vide', 'Vacuum-sealed packaging')
    ),
    details: {
      ...(product.details || {}),
      grade: product.details && typeof (product.details as { grade?: string }).grade === 'string'
        ? translateGrade((product.details as { grade?: string }).grade || '')
        : (product.details as object | undefined),
    },
  };
}

const blogTranslations: Record<string, Pick<BlogPost, 'title' | 'excerpt' | 'content' | 'category' | 'readTime'>> = {
  'art-du-sechage-vanille': {
    title: 'The art of curing: a decisive step in vanilla aroma',
    excerpt: 'Discover how the Madagascar sun transforms green pods into treasures of world gastronomy.',
    category: 'Craft',
    readTime: '4 min read',
    content: `
      <p class="lead text-lg text-zinc-600 mb-6 font-semibold">Curing is the stage where vanilla develops its full aromatic complexity. In Nosy-Be, we honour a time-tested process built on patience, precision and expertise.</p>
      <h2 class="text-2xl font-serif mt-8 mb-4">A slow process for superior quality</h2>
      <p class="mb-4">After scalding and sweating, the vanilla pods are exposed to the sun for a few hours every day. This solar curing must be perfectly controlled: too much sun would dry the pod too quickly, while insufficient warmth would limit the development of vanillin.</p>
      <figure class="my-8">
        <img src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/sechage-au-soleil.jpg" alt="Vanilla curing under the Madagascar sun" class="w-full h-auto rounded-lg shadow-sm" />
        <figcaption class="text-center text-sm text-zinc-500 mt-2">The pods are carefully spread out on fabric to capture the gentle morning heat.</figcaption>
      </figure>
      <h2 class="text-2xl font-serif mt-8 mb-4">Resting in the shade: maturation in wooden crates</h2>
      <p class="mb-4">Once sun curing is complete, the pods rest for several months in wooden crates lined with parchment paper. This shaded maturation phase refines the vanilla much like a great wine: aromas stabilise and the texture becomes supple and glossy, a hallmark of MSV Nosy-Be quality.</p>
    `,
  },
  'choisir-gousse-vanille-gourmet': {
    title: 'How to choose truly exceptional Gourmet vanilla pods',
    excerpt: 'Appearance, suppleness and aroma: the essential criteria for recognising world-class vanilla.',
    category: 'Advice',
    readTime: '3 min read',
    content: `
      <p class="lead text-lg text-zinc-600 mb-6 font-semibold">Not all vanilla is created equal. For fine pastry work, it is essential to distinguish a professional-grade pod from a standard product.</p>
      <h2 class="text-2xl font-serif mt-8 mb-4">Gloss and suppleness</h2>
      <p class="mb-4">A quality Gourmet or Black vanilla pod should be supple. You should be able to wrap it around your finger without breaking it. Its skin should feel slightly oily and glossy, a sign that it is rich in aromatic seeds.</p>
      <figure class="my-8">
        <img src="/photos-produit-vanille/galerie-photos-qui-sommes-nous/triage-et-calibrage.jpg" alt="Vanilla quality control" class="w-full h-auto rounded-lg shadow-sm" />
        <figcaption class="text-center text-sm text-zinc-500 mt-2">Careful hand-sorting isolates the finest pods for our Gourmet selection.</figcaption>
      </figure>
      <h2 class="text-2xl font-serif mt-8 mb-4">Length as a mark of prestige</h2>
      <p class="mb-4">At MSV Nosy-Be, our vanilla is graded by length. Pods measuring 16 to 18 cm are especially prized by chefs because they yield far more seeds than shorter formats.</p>
    `,
  },
  'poivre-sauvage-madagascar-tresor': {
    title: 'Wild Madagascar pepper: an overlooked treasure',
    excerpt: 'Also known as Voatsiperifery, this rare pepper offers unique woody and floral notes.',
    category: 'Discovery',
    readTime: '5 min read',
    content: `
      <p class="lead text-lg text-zinc-600 mb-6 font-semibold">If there is one spice in Madagascar that rivals vanilla in prestige, it is wild pepper, known locally as Voatsiperifery.</p>
      <h2 class="text-2xl font-serif mt-8 mb-4">A demanding harvest</h2>
      <p class="mb-4">Unlike classic black pepper, Voatsiperifery grows wild on vines that can reach more than 20 metres in height. Harvesting is done by hand in the Malagasy forest, making it a rare and precious ingredient.</p>
      <figure class="my-8">
        <img src="/photos-produit-vanille/poivre-sauvage-madagascar.jpg" alt="Wild Madagascar pepper berries" class="w-full h-auto rounded-lg shadow-sm" />
        <figcaption class="text-center text-sm text-zinc-500 mt-2">Wild pepper is recognisable by its delicate tail still attached to the berry.</figcaption>
      </figure>
      <h2 class="text-2xl font-serif mt-8 mb-4">In the kitchen: subtle yet expressive</h2>
      <p class="mb-4">Less aggressive than black pepper, it reveals notes of citrus, wood and earth. It pairs beautifully with white meats, but also with chocolate and red fruit desserts, where it elevates sweetness without overpowering it.</p>
    `,
  },
};

export function getLocalizedBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale === 'fr') return post;

  const translated = blogTranslations[post.slug];
  if (!translated) return post;

  return {
    ...post,
    ...translated,
  };
}
