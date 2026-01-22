export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Fixed production API URL
    const apiUrl = 'https://www.tsniout-shop.fr';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiUrl}${cleanPath}`;
}
