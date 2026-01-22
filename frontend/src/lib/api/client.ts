// API Client base configuration

// Ensure API_URL has protocol, default to http for localhost
const getApiUrl = () => {
    // Production Railway URL
    const railwayUrl = 'https://tsniout-production.up.railway.app';
    const envUrl = process.env.NEXT_PUBLIC_API_URL;

    // If we are on the production domain, force railway URL if env is not set
    if (typeof window !== 'undefined' && (window.location.hostname.includes('tsniout-shop.fr') || window.location.hostname.includes('vercel.app'))) {
        return envUrl || railwayUrl;
    }

    return envUrl || railwayUrl || 'http://localhost:3001';
};

const API_URL = getApiUrl();

export class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

interface FetchOptions extends RequestInit {
    token?: string;
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            cache: 'no-store',
        });

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
            }
            return {} as T;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data.message || `HTTP ${response.status}: ${response.statusText}`
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error occurred');
    }
}

export const api = {
    get: <T>(endpoint: string, token?: string) =>
        apiClient<T>(endpoint, { method: 'GET', token }),

    post: <T>(endpoint: string, data?: unknown, token?: string) =>
        apiClient<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            token,
        }),

    put: <T>(endpoint: string, data?: unknown, token?: string) =>
        apiClient<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            token,
        }),

    patch: <T>(endpoint: string, data?: unknown, token?: string) =>
        apiClient<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            token,
        }),

    delete: <T>(endpoint: string, token?: string) =>
        apiClient<T>(endpoint, { method: 'DELETE', token }),
};
