import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if maintenance mode is enabled
    // Use a hardcoded value or an environment variable
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

    if (maintenanceMode) {
        // Check if the request is not for the maintenance page itself
        // and not for static assets or API routes
        const { pathname } = request.nextUrl;

        if (
            pathname !== '/maintenance' &&
            !pathname.startsWith('/_next') &&
            !pathname.startsWith('/api') &&
            !pathname.includes('.') // for images, favicons, etc.
        ) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
