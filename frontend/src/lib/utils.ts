export function getImageUrl(path: string | undefined | null) {
    if (!path) return '/placeholder.png'; // Make sure to have a placeholder or handle null
    if (path.startsWith('http')) return path;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Ensure the path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiUrl}${cleanPath}`;
}
