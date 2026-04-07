import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_COOKIE_NAME, delocalizeVisiblePath, normalizeLocale, stripLocalePrefix, withLocale } from '@/lib/i18n';

export function proxy(request: NextRequest) {
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    const { pathname, search } = request.nextUrl;

    if (maintenanceMode) {
        if (
            pathname !== '/maintenance' &&
            !pathname.startsWith('/_next') &&
            !pathname.startsWith('/api') &&
            !pathname.includes('.')
        ) {
            return NextResponse.redirect(new URL('/maintenance', request.url));
        }
    }

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico' ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const localeMatch = pathname.match(/^\/(fr|en)(?=\/|$)/);

    if (!localeMatch) {
        const redirectUrl = new URL(`${withLocale(pathname, 'fr')}${search}`, request.url);
        return NextResponse.redirect(redirectUrl);
    }

    const locale = normalizeLocale(localeMatch[1]);
    const internalPath = delocalizeVisiblePath(pathname, locale);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);
    requestHeaders.set('x-visible-pathname', pathname || withLocale('/', locale));

    const rewrittenUrl = new URL(`${internalPath}${search}`, request.url);
    const response = NextResponse.rewrite(rewrittenUrl, {
        request: {
            headers: requestHeaders,
        },
    });

    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
