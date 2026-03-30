export const DEFAULT_SITE_URL = 'https://msv-nosy-bemada.fr';
export const DEFAULT_API_URL = 'https://vanille-production.up.railway.app';

export function getSiteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function getApiUrl() {
    return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
}

