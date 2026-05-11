export function normalizeGaMeasurementId(rawId?: string | null) {
    if (!rawId) return '';
    const trimmed = rawId.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('G-')) return trimmed;
    if (/^[A-Z0-9]{6,}$/.test(trimmed)) return `G-${trimmed}`;
    return trimmed;
}

export function normalizeGoogleAdsId(rawId?: string | null) {
    if (!rawId) return '';
    const trimmed = rawId.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('AW-')) return trimmed;
    if (/^\d+$/.test(trimmed)) return `AW-${trimmed}`;
    return trimmed;
}
