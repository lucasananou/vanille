const LEGACY_PRODUCT_REF_TO_SLUG: Record<string, string> = {
    'tk-noir-10-13': 'vanille-tk-noir-10-13cm',
    'tk-noir-14-15': 'vanille-tk-noir-14-15cm',
    'tk-noir-16': 'vanille-tk-noir-16cm',
    'tk-noir-17-18': 'vanille-tk-noir-17-18cm',
    'pack-decouverte': 'pack-decouverte',
    'pack-pro': 'pack-pro',
    'poivre-sauvage': 'poivre-sauvage-madagascar',
};

export function normalizeProductRef(ref?: string | null) {
    if (!ref) return '';
    return LEGACY_PRODUCT_REF_TO_SLUG[ref] || ref;
}

export function getLegacyProductSlug(ref?: string | null) {
    return normalizeProductRef(ref);
}
