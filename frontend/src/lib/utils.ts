export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Use Railway URL as default production API
    const railwayUrl = 'https://tsniout-production.up.railway.app';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || railwayUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiUrl}${cleanPath}`;
}
