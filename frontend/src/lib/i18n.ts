export type Locale = 'fr' | 'en';

export const LOCALE_COOKIE_NAME = 'site_locale';

const EN_ROUTE_MAP: Array<[string, string]> = [
  ['/actualites/', '/news/'],
  ['/actualites', '/news'],
  ['/produit/', '/product/'],
  ['/produit', '/product'],
  ['/b2b', '/wholesale'],
  ['/vanille-bourbon-madagascar', '/madagascar-bourbon-vanilla'],
  ['/commande', '/checkout'],
  ['/checkout', '/checkout'],
  ['/cart', '/cart'],
  ['/shop', '/shop'],
  ['/about', '/about'],
  ['/contact', '/contact'],
  ['/blog', '/journal'],
  ['/faq', '/faq'],
  ['/order-confirmation/', '/order-confirmation/'],
];

const FR_ROUTE_MAP: Array<[string, string]> = [
  ['/news/', '/actualites/'],
  ['/news', '/actualites'],
  ['/product/', '/produit/'],
  ['/product', '/produit'],
  ['/wholesale', '/b2b'],
  ['/madagascar-bourbon-vanilla', '/vanille-bourbon-madagascar'],
  ['/journal', '/blog'],
];

export function normalizeLocale(value?: string | null): Locale {
  return value?.toLowerCase() === 'en' ? 'en' : 'fr';
}

export function getLocaleLabel(locale: Locale) {
  return locale === 'en' ? 'English' : 'Français';
}

export function stripLocalePrefix(pathname: string) {
  if (!pathname) return '/';
  const stripped = pathname.replace(/^\/(fr|en)(?=\/|$)/, '');
  return stripped || '/';
}

export function localizeVisiblePath(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);
  if (locale === 'fr') {
    return FR_ROUTE_MAP.reduce((current, [from, to]) => {
      if (current === from || current.startsWith(`${from}/`) || current.startsWith(from)) {
        return current.replace(from, to);
      }
      return current;
    }, stripped);
  }

  return EN_ROUTE_MAP.reduce((current, [from, to]) => {
    if (current === from || current.startsWith(`${from}/`) || current.startsWith(from)) {
      return current.replace(from, to);
    }
    return current;
  }, stripped);
}

export function delocalizeVisiblePath(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);

  if (locale === 'en') {
    return FR_ROUTE_MAP.reduce((current, [from, to]) => {
      if (current === from || current.startsWith(`${from}/`) || current.startsWith(from)) {
        return current.replace(from, to);
      }
      return current;
    }, stripped);
  }

  return stripped;
}

export function withLocale(pathname: string, locale: Locale) {
  if (!pathname) return `/${locale}`;
  if (/^(https?:|mailto:|tel:)/.test(pathname)) return pathname;

  const cleanPath = localizeVisiblePath(pathname, locale);
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
}

export function formatCurrency(amount: number, locale: Locale, currency = 'EUR') {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export const commonCopy = {
  fr: {
    nav: {
      home: 'Accueil',
      shop: 'Boutique',
      news: 'Actualites',
      blog: 'Blog',
      about: 'À propos',
      professionals: 'Professionnels',
      contact: 'Contact',
    },
    actions: {
      discoverShop: 'Boutique',
      viewCart: 'Voir panier',
      checkout: 'Commander',
      addToCart: 'Ajouter au panier',
      remove: 'Supprimer',
      quantityDown: 'Diminuer quantité',
      quantityUp: 'Augmenter quantité',
      closeCart: 'Fermer le panier',
      openCart: 'Ouvrir le panier',
      askQuote: 'Demande de devis',
      contactUs: 'Nous contacter',
      readArticle: "Lire l'article",
      learnMore: 'En savoir plus',
    },
    footer: {
      baseline: 'Vanille de Madagascar',
      promise: '100% naturel & sélectionné à la main.',
      links: 'Liens',
      info: 'Infos',
      social: 'Réseaux',
      cart: 'Panier',
      terms: 'CGV',
      faq: 'FAQ',
      rights: 'Tous droits réservés.',
      terroir: "Vanille de Madagascar — Terroir d'Exception",
    },
    cart: {
      title: 'Votre panier',
      subtitle: 'Finalisez en 2 minutes',
      empty: 'Panier vide',
      emptyText: 'Ajoutez vos gousses préférées.',
      goToShop: 'Aller à la boutique',
      subtotal: 'Sous-total',
      taxesAndShipping: 'Livraison & taxes calculées au paiement.',
      perUnit: '/ unité',
    },
    productCard: {
      soldOut: 'Épuisé',
      noImage: "Pas d'image",
      choose: 'Choisir',
      quickView: 'Aperçu rapide',
      shipped24h: 'Expédié sous 24h',
      details: 'Détails',
      from: 'À partir de',
    },
  },
  en: {
    nav: {
      home: 'Home',
      shop: 'Shop',
      news: 'News',
      blog: 'Journal',
      about: 'About',
      professionals: 'Wholesale',
      contact: 'Contact',
    },
    actions: {
      discoverShop: 'Shop',
      viewCart: 'View cart',
      checkout: 'Checkout',
      addToCart: 'Add to cart',
      remove: 'Remove',
      quantityDown: 'Decrease quantity',
      quantityUp: 'Increase quantity',
      closeCart: 'Close cart',
      openCart: 'Open cart',
      askQuote: 'Request a quote',
      contactUs: 'Contact us',
      readArticle: 'Read article',
      learnMore: 'Learn more',
    },
    footer: {
      baseline: 'Madagascar Vanilla',
      promise: '100% natural and hand-selected.',
      links: 'Links',
      info: 'Information',
      social: 'Social',
      cart: 'Cart',
      terms: 'Terms & Conditions',
      faq: 'FAQ',
      rights: 'All rights reserved.',
      terroir: 'Madagascar Vanilla — A Terroir of Distinction',
    },
    cart: {
      title: 'Your cart',
      subtitle: 'Complete your order in 2 minutes',
      empty: 'Your cart is empty',
      emptyText: 'Add your favourite vanilla pods.',
      goToShop: 'Go to shop',
      subtotal: 'Subtotal',
      taxesAndShipping: 'Shipping and taxes calculated at checkout.',
      perUnit: '/ unit',
    },
    productCard: {
      soldOut: 'Sold out',
      noImage: 'No image',
      choose: 'Choose',
      quickView: 'Quick view',
      shipped24h: 'Ships within 24h',
      details: 'Details',
      from: 'From',
    },
  },
} as const;
