export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;

    // Use environment variable for API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiUrl}${cleanPath}`;
}
