import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPathPublic = path === '/login' || path === '/signup';
    const token = request.cookies.get('token')?.value || '';

    if (!isPathPublic && !token) {
        // Redirect to login if accessing a protected route without a token
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (isPathPublic && token) {
        // Redirect to profile if trying to access public routes with an active token
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    // If no redirection occurs, proceed with the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/profile',
        // You can include other pages here, like `/dashboard`, `/settings`, etc.
        '/dashboard',
        '/settings',
    ],
};
