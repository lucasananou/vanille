export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Historical catalog/media assets are shipped with the frontend app.
    if (
        cleanPath.startsWith('/photos-produit-vanille/') ||
        cleanPath.startsWith('/logo_') ||
        cleanPath.startsWith('/bg-') ||
        cleanPath === '/placeholder.png'
    ) {
        return cleanPath;
    }

    // Admin-uploaded assets are served by the backend.
    const railwayUrl = 'https://vanille-production.up.railway.app';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || railwayUrl;

    if (cleanPath.startsWith('/uploads/') || cleanPath.startsWith('/public/')) {
        return `${apiUrl}${cleanPath}`;
    }

    return cleanPath;
}
