
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const sessionForCookie = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Helper to verify token
    const verifyToken = async (token: string) => {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-fallback-change-me');
            const { payload } = await jwtVerify(token, secret);
            return payload;
        } catch (error) {
            return null;
        }
    };

    // 1. ADMIN PROTECTION
    // If trying to access /admin (but not /admin/login which doesn't exist yet, assumed under /login)
    // Actually /admin routes should be protected.
    if (pathname.startsWith('/admin')) {
        if (!sessionForCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(sessionForCookie.value);
        if (!payload) {
            // Invalid token
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check Role
        // @ts-ignore
        if (payload.role !== 'ADMIN') {
            // User is logged in but NOT admin -> Redirect to Home or 403
            return NextResponse.redirect(new URL('/', request.url));
        }

        // If Admin, proceed
        // We can also set headers here if needed
        return NextResponse.next();
    }

    // 2. CHECKOUT PROTECTION (Optional, but good practice)
    // If verifyCheckout/Checkout page requires login
    if (pathname.startsWith('/checkout') || pathname.startsWith('/cart/checkout')) {
        if (!sessionForCookie) {
            // Redirect to login, but save the return URL could be nice
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
        // Verify validity even if role doesn't matter
        const payload = await verifyToken(sessionForCookie.value);
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. API PROTECTION (Optional for now, but /api/admin should be secured)
    if (pathname.startsWith('/api/admin')) {
        if (!sessionForCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const payload = await verifyToken(sessionForCookie.value);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return NextResponse.next();
}

// Config to limit middleware execution path
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/checkout/:path*',
        // Add other protected routes
    ],
};
